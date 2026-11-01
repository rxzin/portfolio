"use client";

import { useEffect, useRef } from "react";

const GAP = 14; // px between dots
const REACH = 110; // px radius of pointer influence
const IDLE_AFTER = 2500; // ms without pointer before the ambient drift takes over
const RING_SPEED = 320; // px per second
const RING_WIDTH = 22;
const RING_LIFE = 1.3; // seconds

type RGB = [number, number, number];

function readColor(name: string, fallback: RGB): RGB {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  if (!m) return fallback;
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mix = (a: RGB, b: RGB, t: number) =>
  `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(",")})`;

/**
 * The page's signature moment: a dot grid that swells and lights up around the pointer,
 * sends a ripple on click/tap, and drifts gently on its own when nobody is pointing at it.
 */
export default function Cover() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let base: RGB = [0, 0, 0];
    let accent: RGB = [0, 0, 0];
    const readTheme = () => {
      base = readColor("--ink-muted", [86, 96, 112]);
      accent = readColor("--accent", [47, 91, 234]);
    };

    // pointer state (target + smoothed), rings, idle tracking
    const target = { x: -9999, y: -9999 };
    const p = { x: -9999, y: -9999, s: 0 };
    let lastPointer = Number.NEGATIVE_INFINITY;
    const rings: { x: number; y: number; t0: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // where the light is: the pointer, or a slow drift when idle
      const idle = now - lastPointer > IDLE_AFTER;
      const tx = idle ? w * (0.5 + 0.38 * Math.sin(t * 0.37)) : target.x;
      const ty = idle ? h * (0.5 + 0.3 * Math.sin(t * 0.53 + 1)) : target.y;
      const ts = reduce ? 0 : idle ? 0.55 : 1;
      p.x += (tx - p.x) * 0.12;
      p.y += (ty - p.y) * 0.12;
      p.s += (ts - p.s) * 0.06;

      for (let i = rings.length - 1; i >= 0; i--)
        if (t - rings[i].t0 > RING_LIFE) rings.splice(i, 1);

      const cols = Math.ceil(w / GAP);
      const rows = Math.ceil(h / GAP);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * GAP;
          const y = oy + r * GAP;
          const dx = x - p.x;
          const dy = y - p.y;
          const d = Math.hypot(dx, dy);
          let f = Math.max(0, 1 - d / REACH) ** 2 * p.s;

          for (const ring of rings) {
            const age = t - ring.t0;
            const rd = Math.abs(
              Math.hypot(x - ring.x, y - ring.y) - age * RING_SPEED,
            );
            f = Math.max(
              f,
              Math.max(0, 1 - rd / RING_WIDTH) * (1 - age / RING_LIFE),
            );
          }

          const push = f * 6;
          const px = d > 0.01 ? x + (dx / d) * push : x;
          const py = d > 0.01 ? y + (dy / d) * push : y;
          ctx.globalAlpha = 0.35 + f * 0.65;
          ctx.fillStyle = mix(base, accent, Math.min(1, f * 1.4));
          ctx.beginPath();
          ctx.arc(px, py, 1 + f * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden && !reduce)
        raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      target.x = x;
      target.y = y;
      lastPointer = performance.now();
    };
    const onLeave = () => {
      lastPointer = Number.NEGATIVE_INFINITY;
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      if (!reduce) rings.push({ ...toLocal(e), t0: performance.now() / 1000 });
    };

    readTheme();
    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const themeWatch = new MutationObserver(() => {
      readTheme();
      draw(performance.now());
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="rule-b relative">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block h-36 w-full touch-pan-y sm:h-44"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-3 font-mono text-[0.75rem] text-ink-muted"
      >
        hover or tap
      </span>
      <span aria-hidden className="cross left-0 top-full" />
      <span aria-hidden className="cross left-full top-full" />
    </div>
  );
}
