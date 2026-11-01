// Decorative atmosphere: blue glows, drifting "packets" (the reference's fish), "+" markers.
// Everything here is aria-hidden and pointer-events-none; sections clip their own overflow.

/** Large soft electric-blue light. Uses a radial gradient (cheaper than filter: blur). */
export function Glow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full opacity-80 [background:radial-gradient(closest-side,var(--glow),transparent)] ${className}`}
    />
  );
}

/** "+" marker at a position (left/top classes). */
export function Cross({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`crosshair ${className}`} />;
}

function random(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A data packet that reads as a small fish: rounded body with a forked tail. */
function PacketShape({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 16"
      className="h-full w-full"
      fill={color}
      style={{ opacity }}
    >
      <path d="M2 8c0-3.3 4.5-6 11-6h11c4 0 7 2.7 7 6s-3 6-7 6H13C6.5 14 2 11.3 2 8Z" />
      <path d="M30 8l9-6v12z" />
    </svg>
  );
}

interface PacketsProps {
  seed: number;
  count?: number;
  /** area the school occupies, as position/size classes */
  className?: string;
}

/**
 * A school of packets drifting slowly left. Each starts mid-journey (negative delay) so the
 * motion is already underway on load. Stops with prefers-reduced-motion (global CSS rule).
 */
export function Packets({ seed, count = 14, className = "" }: PacketsProps) {
  const rand = random(seed);
  const items = Array.from({ length: count }, (_, i) => {
    const big = rand() > 0.75;
    const w = big ? 34 + rand() * 18 : 14 + rand() * 14;
    return {
      key: i,
      top: `${rand() * 92}%`,
      left: `${10 + rand() * 85}%`,
      w,
      color: rand() > 0.35 ? "var(--blood-bright)" : "var(--glow)",
      opacity: 0.55 + rand() * 0.45,
      duration: `${22 + rand() * 26}s`,
      delay: `${-rand() * 40}s`,
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    >
      {items.map((p) => (
        <span
          key={p.key}
          className="absolute block animate-drift"
          style={
            {
              top: p.top,
              left: p.left,
              width: p.w,
              height: p.w * 0.4,
              "--drift-duration": p.duration,
              "--drift-distance": "-55vw",
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        >
          <PacketShape color={p.color} opacity={p.opacity} />
        </span>
      ))}
    </div>
  );
}
