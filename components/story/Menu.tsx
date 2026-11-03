"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";

/**
 * Fixed square menu button + full-screen chapter index.
 * Always visible below xl (the hero's inline links are hidden there); on xl it appears once
 * the hero has scrolled away.
 */
export default function Menu() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const lenis = useLenis();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) =>
    setPastHero(y > window.innerHeight * 0.6),
  );

  // pause smooth scroll, close on Escape, move focus in and back out
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // keep Tab inside the overlay: the page behind it can't take focus while it is covered
    const page = document.querySelectorAll<HTMLElement>("header, main, footer");
    for (const el of page) el.inert = true;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const button = buttonRef.current;
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      for (const el of page) el.inert = false;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open, lenis]);

  return (
    <>
      <div
        data-shown={pastHero || open}
        className="fixed right-5 top-3.5 z-[70] transition-opacity duration-500 sm:right-8 sm:top-[1.375rem] lg:right-10 xl:top-6 xl:pointer-events-none xl:opacity-0 xl:focus-within:pointer-events-auto xl:focus-within:opacity-100 xl:data-[shown=true]:pointer-events-auto xl:data-[shown=true]:opacity-100"
      >
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="chapter-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-12 w-12 place-items-center border border-rule bg-bg/70 backdrop-blur-md transition-colors hover:border-ink"
        >
          <span
            className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`}
          />
          <span
            className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="chapter-menu"
            aria-label="Chapters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-bg"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[20vmax] top-1/4 h-[60vmax] w-[60vmax] rounded-full opacity-70 [background:radial-gradient(closest-side,var(--glow),transparent)]"
            />
            <ol className="relative mx-auto flex min-h-full max-w-[90rem] flex-col justify-center gap-2 px-5 py-24 sm:px-8 lg:px-10">
              {site.nav.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05 * i,
                    ease: ease.outExpo,
                  }}
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={(e) => {
                      // smooth scroll is paused while open: close first, then scroll once resumed
                      e.preventDefault();
                      setOpen(false);
                      requestAnimationFrame(() => {
                        if (lenis) {
                          lenis.start();
                          lenis.scrollTo(l.href);
                        } else document.querySelector(l.href)?.scrollIntoView();
                      });
                    }}
                    className="group flex items-baseline gap-4 py-1"
                  >
                    <span className="text-label text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(2.25rem,7vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.025em] transition-colors group-hover:text-blood-bright">
                      {l.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ol>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
