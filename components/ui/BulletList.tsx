"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { dur, ease } from "@/lib/motion";
import { rich } from "@/lib/rich";

const VISIBLE = 3;

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-[0.75em] h-px w-3 shrink-0 bg-ink-muted"
      />
      <span>{rich(text)}</span>
    </li>
  );
}

/** Shows the first few bullets; the rest expand behind "Show more". */
export default function BulletList({
  items,
  className = "text-ink-muted",
}: {
  items: string[];
  /** text color; pass a lighter tone on crimson boxes for contrast */
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const moreId = useId();
  const first = items.slice(0, VISIBLE);
  const rest = items.slice(VISIBLE);

  return (
    <div className={`mt-4 ${className}`}>
      <ul className="space-y-2">
        {first.map((b) => (
          <Bullet key={b} text={b} />
        ))}
      </ul>

      {rest.length > 0 && (
        <>
          <motion.div
            id={moreId}
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: dur.slow, ease: ease.outExpo }}
            className="overflow-hidden"
            inert={!open}
          >
            <ul className="space-y-2 pt-2">
              {rest.map((b) => (
                <Bullet key={b} text={b} />
              ))}
            </ul>
          </motion.div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={moreId}
            className="mt-2 py-2 text-label font-semibold uppercase text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
          >
            {open ? "Show less" : `Show ${rest.length} more`}
          </button>
        </>
      )}
    </div>
  );
}
