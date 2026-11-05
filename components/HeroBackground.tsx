"use client";

import Beams from "@/components/Beams";
import { useIsDark } from "@/lib/use-is-dark";
import { useRenderDpr } from "@/lib/use-render-dpr";

const COLOR = "#8fb0ff";

/**
 * The hero's background. To try a different one, change only this component: return anything
 * that fills its parent (h-full w-full). Intro handles the placement, sizing and layering.
 * For WebGL backgrounds, pass useRenderDpr() as their pixel density so they stay smooth on phones.
 */
export default function HeroBackground() {
  const isDark = useIsDark();
  const dpr = useRenderDpr();
  // the beams are soft, so on phones (dpr is set) their light field can render at a lower resolution
  const quality = dpr ? 0.5 : undefined;
  return isDark ? (
    <Beams color={COLOR} brightness={2} dpr={dpr} quality={quality} />
  ) : (
    // light mode draws the beams as shade on the pale page, so it needs driving harder to show
    <Beams lightMode color={COLOR} brightness={6} dpr={dpr} quality={quality} />
  );
}
