"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  BURST_SECONDS,
  type Burst,
  createSchool,
  type Fish,
  type Point,
  type Shark,
  SPINE_POINTS,
  stepSchool,
} from "@/lib/school";

/** How far past the home area the canvas reaches, so a fish turning at the edge is never cut off. */
const BLEED = 120;
/** One fish per this many px² of home area, capped by `count`, so phones get a smaller school. */
const AREA_PER_FISH = 14000;
const TWO_PI = Math.PI * 2;
/** Average frame time above which the fish update at half rate. */
const SLOW_FRAME_MS = 26;
/** A home area narrower than this, px, is too cramped for a shark. */
const SHARK_MIN_AREA = 150;

/** Half-width of the body as a fraction of its length, from nose (0) to base of the tail (1). */
const PROFILE: [number, number][] = [
  [0, 0.012],
  [0.06, 0.058],
  [0.15, 0.094],
  [0.26, 0.106],
  [0.42, 0.094],
  [0.6, 0.066],
  [0.8, 0.032],
  [1, 0.016],
];

/** The shark: a pointed snout, thickest behind the fins, then a long taper. */
const SHARK_PROFILE: [number, number][] = [
  [0, 0],
  [0.08, 0.036],
  [0.2, 0.074],
  [0.32, 0.086],
  [0.5, 0.068],
  [0.7, 0.04],
  [0.88, 0.019],
  [1, 0.014],
];

function widthsOf(profile: [number, number][]) {
  return Array.from({ length: SPINE_POINTS }, (_, k) => {
    const s = k / (SPINE_POINTS - 1);
    const i = profile.findIndex(([at]) => at >= s);
    if (i <= 0) return profile[0][1];
    const [a, wa] = profile[i - 1];
    const [b, wb] = profile[i];
    return wa + ((wb - wa) * (s - a)) / (b - a);
  });
}

const WIDTHS = widthsOf(PROFILE);
const SHARK_WIDTHS = widthsOf(SHARK_PROFILE);

interface Shades {
  light: string;
  base: string;
  deep: string;
  fin: string;
}

function mix(hex: string, target: number, amount: number) {
  const channel = (i: number) => {
    const value = Number.parseInt(hex.slice(i, i + 2), 16);
    return Math.round(value + (target - value) * amount);
  };
  return [channel(1), channel(3), channel(5)].join(",");
}

function shadesOf(hex: string, lift: number): Shades {
  return {
    light: `rgb(${mix(hex, 255, 0.4 + lift)})`,
    base: `rgb(${mix(hex, 255, lift)})`,
    deep: `rgb(${mix(hex, 0, 0.45)})`,
    fin: `rgba(${mix(hex, 255, 0.15 + lift)},0.62)`,
  };
}

// Reused for every fish on every frame, so drawing allocates as little as possible.
const px = new Float64Array(SPINE_POINTS);
const py = new Float64Array(SPINE_POINTS);
const nx = new Float64Array(SPINE_POINTS);
const ny = new Float64Array(SPINE_POINTS);

/** Backbone with the swimming wave added: nothing at the head, growing toward the tail. */
function undulate(f: Fish, amount = 0.09) {
  const last = SPINE_POINTS - 1;
  for (let k = 0; k <= last; k++) {
    const a = Math.min(k, last - 1);
    const dx = f.spine[a * 2] - f.spine[a * 2 + 2];
    const dy = f.spine[a * 2 + 1] - f.spine[a * 2 + 3];
    const d = Math.hypot(dx, dy) || 1;
    nx[k] = -dy / d;
    ny[k] = dx / d;
    const s = k / last;
    const wave =
      f.size * amount * (s * s + 0.08 * s) * Math.sin(f.phase - s * 5.2);
    px[k] = f.spine[k * 2] + nx[k] * wave;
    py[k] = f.spine[k * 2 + 1] + ny[k] * wave;
  }
}

function bodyPath(f: Fish, scale: number, widths = WIDTHS, nose = 0.8) {
  const last = SPINE_POINTS - 1;
  const edge = (k: number, side: number) => {
    // the nose itself has no width, so its curve borrows the next point's to stay rounded
    const w = (k === 0 ? widths[1] * nose : widths[k]) * f.size * scale * side;
    return { x: px[k] + nx[k] * w, y: py[k] + ny[k] * w };
  };
  const path = new Path2D();
  path.moveTo(px[0], py[0]);
  for (let k = 0; k < last; k++) {
    const p = edge(k, 1);
    const q = edge(k + 1, 1);
    path.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
  }
  const endA = edge(last, 1);
  const endB = edge(last, -1);
  path.lineTo(endA.x, endA.y);
  path.lineTo(endB.x, endB.y);
  for (let k = last; k > 0; k--) {
    const p = edge(k, -1);
    const q = edge(k - 1, -1);
    path.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
  }
  const front = edge(0, -1);
  path.quadraticCurveTo(front.x, front.y, px[0], py[0]);
  path.closePath();
  return path;
}

/** A fin swept back from the body; `spread` is its angle away from the line of the tail. */
function fin(
  ctx: CanvasRenderingContext2D,
  k: number,
  side: number,
  length: number,
  spread: number,
) {
  const a = Math.min(k, SPINE_POINTS - 2);
  const backX = px[a + 1] - px[a];
  const backY = py[a + 1] - py[a];
  const back = Math.atan2(backY, backX) - side * spread;
  const rootX = px[k] + nx[k] * side * WIDTHS[k] * length * 2.2;
  const rootY = py[k] + ny[k] * side * WIDTHS[k] * length * 2.2;
  const tipX = rootX + Math.cos(back) * length;
  const tipY = rootY + Math.sin(back) * length;
  const trailX = rootX + (backX / Math.hypot(backX, backY)) * length * 0.55;
  const trailY = rootY + (backY / Math.hypot(backX, backY)) * length * 0.55;
  ctx.beginPath();
  ctx.moveTo(rootX, rootY);
  ctx.quadraticCurveTo(
    rootX + nx[k] * side * length * 0.45,
    rootY + ny[k] * side * length * 0.45,
    tipX,
    tipY,
  );
  ctx.quadraticCurveTo(
    (tipX + trailX) / 2 + nx[k] * side * length * 0.26,
    (tipY + trailY) / 2 + ny[k] * side * length * 0.26,
    trailX,
    trailY,
  );
  ctx.closePath();
  ctx.fill();
}

function tail(
  ctx: CanvasRenderingContext2D,
  f: Fish,
  size = 0.32,
  spread = 0.5,
  fork = 0.68,
) {
  const last = SPINE_POINTS - 1;
  const sway = Math.sin(f.phase - 6.1) * 0.5;
  const angle =
    Math.atan2(py[last] - py[last - 1], px[last] - px[last - 1]) + sway;
  const length = f.size * size;
  const at = (a: number, r: number): Point => ({
    x: px[last] + Math.cos(angle + a) * r,
    y: py[last] + Math.sin(angle + a) * r,
  });
  const tipA = at(spread, length);
  const tipB = at(-spread, length);
  const notch = at(0, length * fork);
  const outerA = at(spread * 1.24, length * 0.55);
  const outerB = at(-spread * 1.24, length * 0.55);
  const innerA = at(spread * 0.4, length * 0.86);
  const innerB = at(-spread * 0.4, length * 0.86);
  ctx.beginPath();
  // from one link up the body, so there's no gap where the fin joins
  ctx.moveTo(px[last - 1], py[last - 1]);
  ctx.quadraticCurveTo(outerA.x, outerA.y, tipA.x, tipA.y);
  ctx.quadraticCurveTo(innerA.x, innerA.y, notch.x, notch.y);
  ctx.quadraticCurveTo(innerB.x, innerB.y, tipB.x, tipB.y);
  ctx.quadraticCurveTo(outerB.x, outerB.y, px[last - 1], py[last - 1]);
  ctx.fill();
}

function drawFish(ctx: CanvasRenderingContext2D, f: Fish, shades: Shades) {
  undulate(f);
  const last = SPINE_POINTS - 1;
  const body = bodyPath(f, 1);
  ctx.globalAlpha = f.depth;

  // shadow on the water below, offset as if lit from above
  ctx.save();
  ctx.translate(f.size * 0.07, f.size * 0.12);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fill(body);
  ctx.restore();

  ctx.fillStyle = shades.fin;
  tail(ctx, f);
  const pectoral = Math.round(last * 0.24);
  const pelvic = Math.round(last * 0.58);
  const paddle = Math.sin(f.phase * 0.5) * 0.22;
  // the fin on the inside of a turn flares out, like a brake
  const lean = Math.max(-0.5, Math.min(0.5, f.turn * 0.22));
  for (const side of [1, -1]) {
    const spread = 0.82 + paddle * side + lean * side;
    fin(ctx, pectoral, side, f.size * 0.24, spread);
    fin(ctx, pelvic, side, f.size * 0.13, 0.55);
  }

  const shade = ctx.createLinearGradient(px[0], py[0], px[last], py[last]);
  shade.addColorStop(0, shades.light);
  shade.addColorStop(0.32, shades.base);
  shade.addColorStop(1, shades.deep);
  ctx.fillStyle = shade;
  ctx.fill(body);

  // the rounded back catches the light along its ridge
  ctx.globalAlpha = f.depth * 0.32;
  ctx.fillStyle = shades.light;
  ctx.fill(bodyPath(f, 0.42));
  ctx.globalAlpha = f.depth;

  if (f.size >= 24) {
    const k = 1;
    const reach = WIDTHS[k] * f.size * 0.86;
    ctx.fillStyle = "rgba(4,4,8,0.9)";
    for (const side of [1, -1]) {
      ctx.beginPath();
      ctx.arc(
        px[k] + nx[k] * side * reach,
        py[k] + ny[k] * side * reach,
        Math.max(0.8, f.size * 0.018),
        0,
        TWO_PI,
      );
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawShark(
  ctx: CanvasRenderingContext2D,
  shark: Shark,
  shades: Shades,
) {
  const f = shark.fish;
  // the whole body thrashes for a moment after a catch
  undulate(f, 0.055 + shark.chomp * 0.08);
  const last = SPINE_POINTS - 1;
  const body = bodyPath(f, 1, SHARK_WIDTHS, 0.32);

  ctx.save();
  ctx.translate(f.size * 0.05, f.size * 0.08);
  ctx.fillStyle = "rgba(0,0,0,0.34)";
  ctx.fill(body);
  ctx.restore();

  ctx.fillStyle = shades.fin;
  tail(ctx, f, 0.26, 0.3, 0.42);
  const lean = Math.max(-0.4, Math.min(0.4, f.turn * 0.2));
  for (const side of [1, -1]) {
    fin(ctx, Math.round(last * 0.27), side, f.size * 0.31, 0.92 + lean * side);
    fin(ctx, Math.round(last * 0.68), side, f.size * 0.09, 0.6);
  }

  const shade = ctx.createLinearGradient(px[0], py[0], px[last], py[last]);
  shade.addColorStop(0, shades.base);
  shade.addColorStop(0.45, shades.base);
  shade.addColorStop(1, shades.deep);
  ctx.fillStyle = shade;
  ctx.fill(body);

  // pale along the flanks, dark along the back, as a shark is from above
  ctx.fillStyle = shades.deep;
  ctx.globalAlpha = 0.55;
  ctx.fill(bodyPath(f, 0.5, SHARK_WIDTHS, 0.32));
  ctx.globalAlpha = 1;

  // the dorsal fin stands up from the back: from above, a thin dark blade
  const a = Math.round(last * 0.36);
  const b = Math.round(last * 0.56);
  ctx.strokeStyle = shades.deep;
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1.4, f.size * 0.018);
  ctx.beginPath();
  ctx.moveTo(px[a], py[a]);
  ctx.lineTo(px[b], py[b]);
  ctx.stroke();

  // eyes wide apart on the head
  ctx.fillStyle = "rgba(4,4,8,0.95)";
  for (const side of [1, -1]) {
    const reach = SHARK_WIDTHS[1] * f.size * 0.82 * side;
    ctx.beginPath();
    ctx.arc(
      px[1] + nx[1] * reach,
      py[1] + ny[1] * reach,
      Math.max(0.9, f.size * 0.011),
      0,
      TWO_PI,
    );
    ctx.fill();
  }

  // jaws: a dark wedge opening at the snout as it closes in
  if (shark.gape > 0.05) {
    const open = SHARK_WIDTHS[2] * f.size * shark.gape * 0.9;
    ctx.fillStyle = "rgb(10,6,10)";
    ctx.beginPath();
    ctx.moveTo(px[2], py[2]);
    ctx.lineTo(px[0] + nx[0] * open, py[0] + ny[0] * open);
    ctx.lineTo(px[0] - nx[0] * open, py[0] - ny[0] * open);
    ctx.closePath();
    ctx.fill();
  }
}

/** Bubbles and a few crimson flecks where a fish was caught; they rise and fade. */
function drawBurst(ctx: CanvasRenderingContext2D, b: Burst, fleck: string) {
  const t = b.age / BURST_SECONDS;
  const ease = 1 - (1 - t) ** 3;
  for (let i = 0; i < 9; i++) {
    const angle = i * 2.4 + b.x;
    const reach = (14 + (i % 3) * 13) * ease;
    const x = b.x + Math.cos(angle) * reach;
    const y = b.y + Math.sin(angle) * reach - 18 * t * t;
    ctx.globalAlpha = (1 - t) * 0.85;
    if (i % 3 === 0) {
      ctx.fillStyle = fleck;
      ctx.beginPath();
      ctx.arc(x, y, 1.8 * (1 - t) + 0.5, 0, TWO_PI);
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgb(226,232,245)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 4) * 0.8, 0, TWO_PI);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

interface SchoolProps {
  seed: number;
  /** most fish in the school; small home areas get fewer */
  count?: number;
  /** the school's home area, as position/size classes */
  className?: string;
  /** whether a shark patrols this school (if its area is big enough for one) */
  shark?: boolean;
}

/**
 * A school of fish, seen from above, swimming in any direction around its home area. A shark may
 * patrol it, and now and then it catches one.
 * Runs only while on screen. With reduced motion it draws one still frame of the school.
 */
export default function School({
  seed,
  count = 14,
  className = "",
  shark = true,
}: SchoolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const area = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !area || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    // the canvas normalizes any CSS color to #rrggbb
    const token = (name: string) => {
      ctx.fillStyle = css.getPropertyValue(name).trim();
      return String(ctx.fillStyle);
    };
    const palette = {
      crimson: shadesOf(token("--blood-bright"), 0),
      // lifted, or the blue fish would vanish into the blue glow
      blue: shadesOf(token("--glow"), 0.28),
    };
    const sharkShades = shadesOf(token("--shark"), 0);
    const fleck = token("--blood-bright");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let school: ReturnType<typeof createSchool> | null = null;
    let client: Point | null = null;
    let frame = 0;
    let last = 0;
    let seen = 0;
    let pace = 16;
    let skip = false;

    const draw = () => {
      if (!school) return;
      ctx.setTransform(dpr, 0, 0, dpr, BLEED * dpr, BLEED * dpr);
      ctx.clearRect(-BLEED, -BLEED, width + BLEED * 2, height + BLEED * 2);
      for (const f of school.fish) drawFish(ctx, f, palette[f.tone]);
      if (school.shark) drawShark(ctx, school.shark, sharkShades);
      for (const b of school.bursts) drawBurst(ctx, b, fleck);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!school) return;
      // on a struggling device, drop to every other frame: scrolling matters more than the fish
      pace += (now - seen - pace) * 0.05;
      seen = now;
      skip = pace > SLOW_FRAME_MS && !skip;
      if (skip) return;
      // long pauses (a hidden tab) resume smoothly instead of jumping
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      let pointer: Point | null = null;
      if (client) {
        const rect = area.getBoundingClientRect();
        pointer = { x: client.x - rect.left, y: client.y - rect.top };
      }
      stepSchool(school, dt, width, height, pointer);
      draw();
    };

    const resize = new ResizeObserver(() => {
      width = area.clientWidth;
      height = area.clientHeight;
      // hidden at this breakpoint: nothing to draw until the area has a size
      if (!width || !height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (width + BLEED * 2) * dpr;
      canvas.height = (height + BLEED * 2) * dpr;
      if (!school) {
        const fit = Math.round((width * height) / AREA_PER_FISH);
        school = createSchool(
          seed,
          Math.max(3, Math.min(count, fit)),
          width,
          height,
          shark && Math.min(width, height) >= SHARK_MIN_AREA,
        );
        // settle into a school before the first frame is seen
        for (let i = 0; i < 300; i++) {
          stepSchool(school, 1 / 30, width, height, null);
        }
      }
      draw();
    });
    resize.observe(area);

    if (reduce) return () => resize.disconnect();

    const visible = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    visible.observe(canvas);

    const onMove = (e: PointerEvent) => {
      client = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visible.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [seed, count, shark, reduce]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute max-w-none"
        style={{
          left: -BLEED,
          top: -BLEED,
          width: `calc(100% + ${BLEED * 2}px)`,
          height: `calc(100% + ${BLEED * 2}px)`,
        }}
      />
    </div>
  );
}
