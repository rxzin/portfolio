"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth scrolling + global Motion config.
 * - `anchors` makes every <a href="#id"> glide (offset clears the fixed nav).
 * - Users who prefer reduced motion get native scrolling and no transform animations.
 */
export default function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -72 } }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
