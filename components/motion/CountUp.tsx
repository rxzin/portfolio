"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import type { Stat } from "@/data/site";
import { ease } from "@/lib/motion";

const format = (
  n: number,
  { decimals = 0, prefix = "", suffix = "" }: Omit<Stat, "label" | "value">,
) => `${prefix}${n.toFixed(decimals)}${suffix}`;

/** Counts from 0 to the metric's value the first time it enters the viewport. */
export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: Omit<Stat, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: ease.outExpo,
      onUpdate: (n) => {
        el.textContent = format(n, { decimals, prefix, suffix });
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix]);

  // Server-render the final value so the number is correct without JS / for crawlers.
  return (
    <span ref={ref} className="tabular-nums">
      {format(value, { decimals, prefix, suffix })}
    </span>
  );
}
