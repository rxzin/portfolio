"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** seconds */
  delay?: number;
  /** px to rise from */
  y?: number;
  className?: string;
}

/** Fades + lifts its children in the first time they scroll into view. */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: dur.slow, ease: ease.outExpo, delay }}
    >
      {children}
    </motion.div>
  );
}
