// Crimson organic shapes (the reference's "splatter" layer), generated from a seed so every
// instance is distinct but identical between server and client renders.

function random(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Closed smooth path through points (Catmull-Rom converted to cubic Béziers). */
function smooth(points: [number, number][]): string {
  const n = points.length;
  const p = (i: number) => points[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)},${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    const c1 = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6];
    const c2 = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return `${d} Z`;
}

/** A wobbly ring of points; `arms` of them reach far out to make tendrils. */
function blob(
  rand: () => number,
  cx: number,
  cy: number,
  r: number,
  count: number,
  wobble: number,
  arms = 0,
): [number, number][] {
  const armAt = new Set(
    Array.from({ length: arms }, () => Math.floor(rand() * count)),
  );
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + rand() * 0.15;
    const reach = armAt.has(i)
      ? 1.35 + rand() * 0.35
      : 1 - wobble + rand() * wobble;
    return [cx + Math.cos(a) * r * reach, cy + Math.sin(a) * r * reach];
  });
}

export function splatterPath(seed: number): string {
  const rand = random(seed);
  const outer = smooth(blob(rand, 100, 100, 62, 30, 0.28, 6));
  // holes punched through (even-odd fill), kept well inside the outer edge
  const holes = Array.from({ length: 7 + Math.floor(rand() * 5) }, () => {
    const a = rand() * Math.PI * 2;
    const dist = rand() * 34;
    return smooth(
      blob(
        rand,
        100 + Math.cos(a) * dist,
        100 + Math.sin(a) * dist,
        5 + rand() * 9,
        9,
        0.35,
      ),
    );
  });
  return [outer, ...holes].join(" ");
}

interface SplatterProps {
  seed: number;
  className?: string;
}

export default function Splatter({ seed, className = "" }: SplatterProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={splatterPath(seed)} fill="var(--blood)" fillRule="evenodd" />
    </svg>
  );
}
