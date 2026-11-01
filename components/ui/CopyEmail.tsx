"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { site } from "@/data/site";

/** Copies the email; the label confirms for 2s. Sits next to the mailto link, so it only shows the action. */
export default function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email"}
      className="inline-flex h-12 items-center border border-ink px-5 text-label font-semibold uppercase transition-colors hover:bg-ink hover:text-bg"
    >
      <span
        className="relative inline-flex h-5 w-24 overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            {copied ? "Copied" : "Copy email"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
