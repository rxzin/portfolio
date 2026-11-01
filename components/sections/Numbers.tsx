import CountUp from "@/components/motion/CountUp";
import Section from "@/components/ui/Section";
import { site } from "@/data/site";

// 2×2 cells separated by rules: right rule on the left column, bottom rule on the first row.
const cell =
  "border-rule px-5 py-6 sm:px-6 [&:not(:last-child)]:border-b sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0";

export default function Numbers() {
  return (
    <Section id="numbers" title="By the numbers" bodyClassName="">
      <dl className="grid sm:grid-cols-2">
        {site.stats.map((s) => (
          <div
            key={s.label}
            className={`${cell} flex flex-col-reverse justify-end`}
          >
            <dt className="mt-1 max-w-[18rem] text-small text-ink-muted">
              {s.label}
            </dt>
            <dd className="text-stat font-semibold tracking-[-0.02em]">
              <CountUp {...s} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
