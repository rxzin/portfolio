"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import Ferrofluid from "@/components/Ferrofluid";
import { useIsDark } from "@/lib/use-is-dark";
import { useRenderDpr } from "@/lib/use-render-dpr";

// In light mode the second color tints the shadows, so a deep blue is what makes the spikes show on the pale page.
const COLORS = {
  dark: ["#dff1ff", "#6cb6ff", "#8fb0ff"],
  light: ["#2f5bea", "#1e3a8a", "#2f5bea"],
};

/** The animated band between Contact and the footer, ruled like the rest of the column. Decoration, so hidden from screen readers. */
export default function FerrofluidBand() {
  const isDark = useIsDark();
  const dpr = useRenderDpr();
  const ref = useRef<HTMLDivElement>(null);
  // its shader is large and slow to compile, so wait until it's nearly on screen
  const near = useInView(ref, { once: true, margin: "600px" });

  return (
    <div ref={ref} aria-hidden className="rule-t rule-b relative h-[600px]">
      <span className="cross left-0 top-0" />
      <span className="cross left-full top-0" />
      <span className="cross left-0 top-full" />
      <span className="cross left-full top-full" />
      {near && (
        <Ferrofluid
          colors={isDark ? COLORS.dark : COLORS.light}
          spikeHeight={1}
          sharpness={2.5}
          tilt={48}
          mouseInteraction
          clickPulse
          lightMode={!isDark}
          brightness={isDark ? 1 : 1.5}
          dpr={dpr}
        />
      )}
    </div>
  );
}
