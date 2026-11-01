// Responsive audit: loads the site at common device sizes in headless Chrome and checks for
// horizontal overflow, clipped text, tap targets under 24×24px (WCAG 2.2 AA) and tiny text.
//
//   pnpm start            (or pnpm dev) in another terminal
//   pnpm audit:responsive [url]          default http://localhost:3000
//
// Needs Chrome/Chromium; set CHROME_PATH if it isn't found. Screenshots go to .audit/.
// Exits 1 when any check fails.

import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_ = process.argv[2] ?? "http://localhost:3000";
const OUT = ".audit";
const PORT = 9333;
const MIN_FONT_PX = 12;
const MIN_TARGET_PX = 24;

const VIEWPORTS = [
  ["320 small phone", 320, 640, true],
  ["360 android", 360, 780, true],
  ["390 iphone", 390, 844, true],
  ["430 large phone", 430, 932, true],
  ["844x390 phone landscape", 844, 390, true],
  ["768 tablet portrait", 768, 1024, true],
  ["1024 tablet landscape", 1024, 768, true],
  ["1280 laptop", 1280, 800, false],
  ["1920 desktop", 1920, 1080, false],
  ["2560 wide", 2560, 1440, false],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found)
    throw new Error(
      "Chrome not found. Set CHROME_PATH to your Chrome/Chromium executable.",
    );
  return found;
}

// Runs inside the page. Returns a list of human-readable problems.
const PROBE = `(() => {
  const W = innerWidth, problems = [];
  const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ' "' +
    (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40) + '"';
  const visible = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length > 0; };
  const skip = (el) => el.closest('.sr-only, [aria-hidden="true"], [inert]');

  if (document.documentElement.scrollWidth > W) problems.push('page scrolls horizontally');

  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || skip(el)) continue;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > W + 1 && s.position !== 'fixed') problems.push('past right edge: ' + name(el));
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) continue;
    if (parseFloat(s.fontSize) < ${MIN_FONT_PX}) problems.push('text under ${MIN_FONT_PX}px: ' + name(el));
    // text wider than its own box (body has overflow-x: clip, so this would otherwise be hidden)
    // measure only this element's own text (decorations like badges may overhang on purpose)
    if (!s.display.startsWith('inline')) {
      const range = document.createRange();
      const textRight = Math.max(...[...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => { range.selectNodeContents(n); return range.getBoundingClientRect().right; }));
      if (textRight > r.right + 1) problems.push('text overflows box: ' + name(el));
    }
  }

  for (const el of document.querySelectorAll('a, button')) {
    if (!visible(el) || skip(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width >= ${MIN_TARGET_PX} && r.height >= ${MIN_TARGET_PX}) continue;
    // a pseudo-element may enlarge the hit area (trace bars do), so hit-test a 24px box around
    // the center. Only judge elements fully on screen (each one is, in some scroll pass);
    // probe points are clamped to the viewport, since a target cannot extend past it.
    if (r.left < 0 || r.top < 0 || r.right > W || r.bottom > innerHeight) continue;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2, h = ${MIN_TARGET_PX} / 2 - 1;
    const clamp = (v, max) => Math.min(Math.max(v, 0), max - 1);
    const pts = [[cx - h, cy], [cx + h, cy], [cx, cy - h], [cx, cy + h]].map(([x, y]) => [clamp(x, W), clamp(y, innerHeight)]);
    if (!pts.every(([x, y]) => document.elementFromPoint(x, y)?.closest('a, button') === el))
      problems.push('tap target ' + Math.round(r.width) + 'x' + Math.round(r.height) + ': ' + name(el));
  }
  return [...new Set(problems)];
})()`;

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const tabs = await (
        await fetch(`http://127.0.0.1:${PORT}/json/list`)
      ).json();
      const page = tabs.find((t) => t.type === "page");
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r, j) => {
          ws.addEventListener("open", r);
          ws.addEventListener("error", j);
        });
        return ws;
      }
    } catch {}
    await sleep(200);
  }
  throw new Error("Could not connect to headless Chrome.");
}

async function main() {
  try {
    await fetch(URL_);
  } catch {
    console.error(
      `Nothing is serving ${URL_}. Start the site first (pnpm start or pnpm dev).`,
    );
    process.exit(1);
  }

  const profile = mkdtempSync(join(tmpdir(), "audit-chrome-"));
  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${PORT}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let failed = false;
  try {
    const ws = await connect();
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m);
        pending.delete(m.id);
      }
    });
    const send = (method, params = {}) =>
      new Promise((r) => {
        const i = ++id;
        pending.set(i, r);
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    const js = async (expression) =>
      (await send("Runtime.evaluate", { expression, returnByValue: true }))
        .result?.result?.value;
    const shot = async (file) => {
      const r = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(OUT, file), Buffer.from(r.result.data, "base64"));
    };

    mkdirSync(OUT, { recursive: true });
    await send("Page.enable");
    // Measure the layout at rest. Reduced motion makes scroll entrances snap to their final position,
    // and a priming pass (below) scrolls the whole page first so every entrance has fired.
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });

    for (const [label, width, height, mobile] of VIEWPORTS) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
      });
      await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
      await send("Page.navigate", { url: URL_ });
      await sleep(3500); // let the hero animation finish
      const slug = label.split(" ")[0];
      await shot(`${slug}-top.png`);

      // Priming pass: trigger every scroll entrance, so nothing is measured at its pre-entrance offset.
      const total = await js("document.documentElement.scrollHeight");
      for (let y = 0; y < total; y += Math.round(height * 0.5)) {
        await js(`scrollTo(0, ${y})`);
        await sleep(120);
      }
      await sleep(600);

      // Check each screenful while scrolling down.
      const problems = new Set();
      for (let y = 0; y < total; y += Math.round(height * 0.8)) {
        await js(`scrollTo(0, ${y})`);
        await sleep(400);
        for (const p of await js(PROBE)) problems.add(p);
      }
      await shot(`${slug}-bottom.png`);

      console.log(`${problems.size ? "✗" : "✓"} ${label}`);
      for (const p of problems) console.log(`    ${p}`);
      if (problems.size) failed = true;
    }
    ws.close();
  } finally {
    chrome.kill();
    await sleep(300);
    rmSync(profile, { recursive: true, force: true });
  }

  console.log(
    failed
      ? "\nResponsive audit failed."
      : `\nAll ${VIEWPORTS.length} viewports pass. Screenshots in ${OUT}/.`,
  );
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
