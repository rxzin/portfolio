"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { type ReactNode, useRef } from "react";
import { spring } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  /** how far the element follows the pointer, 0–1 */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child toward the pointer on hover and springs back on leave.
 * Uses motion values, so pointer moves never trigger React re-renders.
 */
export default function Magnetic({
  children,
  strength = 0.3,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), spring.snappy);
  const y = useSpring(useMotionValue(0), spring.snappy);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
