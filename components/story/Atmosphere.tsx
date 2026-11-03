// Decorative atmosphere: blue glows, the fish school, "+" markers.
// Everything here is aria-hidden and pointer-events-none; sections clip their own overflow.

export { default as Packets } from "@/components/story/School";

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
