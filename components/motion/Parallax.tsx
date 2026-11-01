"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** px of travel each way while the element crosses the viewport; negative moves against scroll */
  amount?: number;
  className?: string;
}

/** Moves its content vertically at a different rate than the page, for depth on large images. */
export default function Parallax({
  children,
  amount = 60,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
