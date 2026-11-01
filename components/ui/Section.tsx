import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";

interface SectionProps {
  id: string;
  title: string;
  /** small text on the right of the title row, e.g. a count */
  aside?: string;
  /** classes for the body; defaults to standard padding. Pass "" for edge-to-edge grids. */
  bodyClassName?: string;
  children: ReactNode;
}

/** Hatched band between sections, with + marks where its rules meet the column edges. */
export function Gap() {
  return (
    <div aria-hidden className="bg-hatch relative h-10 sm:h-12">
      <span className="cross left-0 top-0" />
      <span className="cross left-full top-0" />
    </div>
  );
}

/** One ruled block of the page: a hatched gap, a title row, then the body. */
export default function Section({
  id,
  title,
  aside,
  bodyClassName = "px-5 py-6 sm:px-6",
  children,
}: SectionProps) {
  return (
    <>
      <Gap />
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        className="rule-t rule-b scroll-mt-16"
      >
        <span aria-hidden className="cross left-0 top-0" />
        <span aria-hidden className="cross left-full top-0" />
        <div className="rule-b flex items-baseline justify-between gap-4 px-5 py-3 sm:px-6">
          <h2
            id={`${id}-title`}
            className="text-h2 font-semibold tracking-[-0.01em]"
          >
            {title}
          </h2>
          {aside && (
            <span className="font-mono text-meta text-ink-muted">{aside}</span>
          )}
        </div>
        <Reveal className={bodyClassName}>{children}</Reveal>
      </section>
    </>
  );
}
