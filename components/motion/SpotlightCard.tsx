"use client";

import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "li";
  id?: string;
}

/**
 * A block with a soft glow that follows the pointer.
 * Writes CSS vars directly (no state); the `.spotlight` class in globals.css paints it.
 */
export default function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
  id,
}: SpotlightCardProps) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <Tag id={id} onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </Tag>
  );
}
