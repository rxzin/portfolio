"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

interface AppearProps {
  children: ReactNode;
  /** where it slides in from */
  from?: "left" | "right" | "below";
  /** seconds */
  delay?: number;
  /** seconds; the reference uses slow 1–2s entrances */
  duration?: number;
  className?: string;
  /** "span" inside headings (phrasing content), "li" inside lists */
  as?: "div" | "span" | "li";
  /** play on page load instead of waiting to scroll into view (above-the-fold content) */
  onLoad?: boolean;
}

const DISTANCE = 80;

/**
 * Slow directional entrance the first time it scrolls into view.
 * Sections clip horizontal overflow, so sliding from the sides never causes sideways scrolling.
 */
export default function Appear({
  children,
  from = "below",
  delay = 0,
  duration = 1.4,
  className,
  as = "div",
  onLoad = false,
}: AppearProps) {
  const offset =
    from === "left"
      ? { x: -DISTANCE }
      : from === "right"
        ? { x: DISTANCE }
        : { y: DISTANCE };
  const Tag =
    as === "span" ? motion.span : as === "li" ? motion.li : motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset }}
      {...(onLoad
        ? { animate: { opacity: 1, x: 0, y: 0 } }
        : {
            whileInView: { opacity: 1, x: 0, y: 0 },
            viewport: { once: true, margin: "0px 0px -8% 0px" },
          })}
      transition={{ duration, delay, ease: ease.outExpo }}
    >
      {children}
    </Tag>
  );
}
