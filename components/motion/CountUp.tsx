"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Stat } from "@/data/site";
import { ease } from "@/lib/motion";

const format = (
  n: number,
  {
    decimals = 0,
    prefix = "",
    suffix = "",
  }: Pick<Stat, "decimals" | "prefix" | "suffix">,
) => `${prefix}${n.toFixed(decimals)}${suffix}`;

/** Counts to the metric's value (from `from`, default 0) the first time it enters the viewport. */
export default function CountUp({
  value,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
}: Omit<Stat, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const el = ref.current;
    const controls = animate(from, value, {
      duration: 1.4,
      ease: ease.outExpo,
      onUpdate: (n) => {
        el.textContent = format(n, { decimals, prefix, suffix });
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, value, decimals, prefix, suffix]);

  // Server-render the final value so the number is correct without JS / for crawlers.
  return (
    <span ref={ref} className="tabular-nums">
      {format(value, { decimals, prefix, suffix })}
    </span>
  );
}
