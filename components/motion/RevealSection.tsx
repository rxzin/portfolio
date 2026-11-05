"use client";

import { type ComponentProps, useEffect, useRef } from "react";

/** A <section> that marks itself data-seen the first time it scrolls into view; globals.css animates from there. */
export default function RevealSection(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.seen = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <section ref={ref} data-reveal {...props} />;
}
