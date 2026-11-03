"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavMark } from "@/components/DotMarks";
import ThemeToggle from "@/components/ThemeToggle";
import { site } from "@/data/site";
import { dur, ease, spring } from "@/lib/motion";

/** The id of whichever section is currently mid-screen. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    // the last section can be too short to ever reach mid-screen, so the page's end counts as reaching it
    const onScroll = () => {
      const { scrollHeight } = document.documentElement;
      if (window.innerHeight + window.scrollY >= scrollHeight - 2)
        setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

const ids = site.nav.map((l) => l.href.slice(1));
// also watch the intro (#top, not in the nav) so no link stays highlighted after scrolling back up
const watched = ["top", ...ids];

export default function Nav() {
  const active = useActiveSection(watched);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Over the hero the bar drops its grid lines and spans the screen, so the logo lines up with the name.
  const [overHero, setOverHero] = useState(true);
  const updateOverHero = useCallback((y: number) => {
    const hero = document.getElementById("top");
    setOverHero(!!hero && y < hero.offsetHeight - 56);
  }, []);
  useEffect(() => updateOverHero(window.scrollY), [updateOverHero]);
  const plain = overHero && !open;
  const idleLink = plain ? "text-ink" : "text-ink-muted";

  // Hide while scrolling down; any upward scroll brings it back.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
    updateOverHero(y);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: dur.base, ease: ease.outExpo }}
      // tabbing into a hidden nav must bring it back, or focus lands somewhere off-screen
      onFocusCapture={() => setHidden(false)}
      // overflow-x-clip: fixed elements escape body clipping, so the full-width rule must be clipped here
      className={`fixed inset-x-0 top-0 z-50 overflow-x-clip px-3 transition-colors duration-500 ease-out-expo sm:px-4 ${
        plain ? "bg-bg/75 backdrop-blur-md" : ""
      }`}
    >
      <div
        className={`mx-auto border-x transition-[max-width,background-color,border-color] duration-500 ease-out-expo ${
          plain
            ? "max-w-[100vw] border-transparent"
            : "rule-b max-w-[46rem] border-rule bg-bg/85 backdrop-blur-md"
        }`}
      >
        <nav
          className="flex h-14 items-center justify-between px-5 sm:px-6"
          aria-label="Primary"
        >
          <a
            href="#top"
            className="flex items-center gap-2.5 py-2 text-small font-semibold"
          >
            <NavMark />
            {site.name}
          </a>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center md:flex">
              {site.nav.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <li key={l.href} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={spring.snappy}
                        className="absolute inset-x-2.5 bottom-0.5 h-px bg-ink"
                      />
                    )}
                    <a
                      href={l.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block px-2.5 py-2 text-small transition-colors ${
                        isActive
                          ? "text-ink"
                          : `${idleLink} after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink-muted after:transition-transform after:duration-300 after:ease-out-expo hover:text-ink hover:after:scale-x-100`
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />

            <button
              ref={menuButton}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative h-9 w-9 md:hidden"
            >
              <span
                className={`absolute left-2 right-2 top-1/2 h-px bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`absolute left-2 right-2 top-1/2 h-px bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: dur.base, ease: ease.outExpo }}
              className="overflow-hidden border-t border-rule px-5 md:hidden"
            >
              {site.nav.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`block py-3 ${isActive ? "text-ink" : "text-ink-muted"}`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
