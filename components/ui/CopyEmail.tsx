"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";
import { dur, ease } from "@/lib/motion";

/** Copy icon that swaps to a check while `copied`. */
function CopyIcon({ copied }: { copied: boolean }) {
  const swap = "col-start-1 row-start-1 h-4 w-4 transition duration-200";
  const away = "scale-50 opacity-0 blur-xs";
  return (
    <span className="grid place-items-center">
      <Icon name="copy" className={`${swap} ${copied ? away : ""}`} />
      <Icon name="check" className={`${swap} ${copied ? "" : away}`} />
    </span>
  );
}

/**
 * Copies the email; the button confirms for 2s. Sits next to a mailto link, so it only shows the action.
 * `compact` is the icon-only version for inline use beside the address.
 */
export default function CopyEmail({ compact }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email"}
        className="inline-grid h-6 w-6 place-items-center align-middle text-ink-muted transition hover:text-ink active:scale-90"
      >
        <CopyIcon copied={copied} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email"}
      className="inline-flex h-11 items-center gap-2 border border-ink px-4 text-small font-semibold transition hover:bg-ink hover:text-panel active:scale-[0.98]"
    >
      <CopyIcon copied={copied} />
      <span
        className="relative inline-flex h-5 w-20 overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.outExpo }}
            className="absolute inset-0 grid place-items-start"
          >
            {copied ? "Copied" : "Copy email"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
