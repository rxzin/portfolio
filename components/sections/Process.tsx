import Section from "@/components/ui/Section";
import { site } from "@/data/site";

export default function Process() {
  return (
    <Section
      id="process"
      title="How I work"
      aside={`${site.process.length} skills`}
      bodyClassName=""
    >
      <ol className="divide-y divide-rule">
        {site.process.map((step, i) => (
          <li
            key={step.stage}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 px-5 py-5 sm:px-6"
          >
            <span aria-hidden className="font-mono text-meta text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">{step.stage}</h3>
                <span className="font-mono text-meta text-ink-muted">
                  {step.skill}
                </span>
              </div>
              <p className="mt-2 text-small text-ink-muted">{step.rule}</p>
              <p className="mt-2 font-mono text-meta text-ink-muted">
                → {step.output}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
