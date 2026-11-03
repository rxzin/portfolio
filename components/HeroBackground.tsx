"use client";

import Beams from "@/components/Beams";
import { useIsDark } from "@/lib/use-is-dark";

const COLOR = "#8fb0ff";

/**
 * The hero's background. To try a different one, change only this component: return anything
 * that fills its parent (h-full w-full). Intro handles the placement, sizing and layering.
 */
export default function HeroBackground() {
  const isDark = useIsDark();
  return isDark ? (
    <Beams color={COLOR} brightness={2} />
  ) : (
    // light mode draws the beams as shade on the pale page, so it needs driving harder to show
    <Beams lightMode color={COLOR} brightness={6} />
  );
}
