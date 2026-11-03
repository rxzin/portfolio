import type { ReactNode } from "react";
import Appear from "@/components/motion/Appear";
import Display from "@/components/story/Display";

/** Shared page width and gutters for every section. */
export const container = "mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-10";

interface ChapterProps {
  id: string;
  number: string;
  label: string;
  headline: string[];
  fade?: number[];
  /** decorative layers (glows, splatters, fish, art) rendered behind the content */
  backdrop?: ReactNode;
  /** content that sits beside/over the headline (e.g. a render), inside the same container */
  aside?: ReactNode;
  /** e.g. "lg:text-right" to mirror the composition */
  headlineClassName?: string;
  children: ReactNode;
}

/**
 * One chapter: marker (number, hairline ending in "+", label) → giant headline → content.
 * overflow-x-clip keeps slide-ins and decorative layers from ever causing sideways scroll.
 */
export default function Chapter({
  id,
  number,
  label,
  headline,
  fade,
  backdrop,
  aside,
  headlineClassName = "",
  children,
}: ChapterProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative scroll-mt-4 overflow-x-clip py-20 sm:py-28 lg:py-32"
    >
      {backdrop}
      <div className={`relative ${container}`}>
        <Appear from="left">
          <p className="text-label text-ink-muted">{number}</p>
          <div className="relative mt-2 h-px w-full max-w-[60rem] bg-rule">
            <span aria-hidden="true" className="crosshair left-full top-0" />
          </div>
          <p className="mt-3 text-label text-ink-muted">{label}</p>
        </Appear>

        <div className="relative mt-12 sm:mt-16">
          <Display
            id={`${id}-title`}
            lines={headline}
            fade={fade}
            className={`relative z-10 ${headlineClassName}`}
          />
          {/* after the headline so phones read headline → image; on lg it is positioned beside/behind */}
          {aside}
        </div>

        {children}
      </div>
    </section>
  );
}

/** The 18px uppercase statement line. */
export function Statement({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-balance text-statement font-semibold uppercase text-ink ${className}`}
    >
      {children}
    </p>
  );
}

/** Crimson box for details (the reference's "HUMAN WASTE ENGULFS WATER SPACES" panel). */
export function CaseFile({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative bg-blood p-6 sm:p-8 ${className}`}>
      <h3 className="text-statement font-semibold uppercase text-ink">
        {title}
      </h3>
      <div className="mt-4 text-ink/80">{children}</div>
    </div>
  );
}
