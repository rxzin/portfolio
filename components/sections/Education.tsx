import Mark from "@/components/ui/Mark";
import Section from "@/components/ui/Section";
import { site } from "@/data/site";

export default function Education() {
  return (
    <Section
      id="education"
      title="Education"
      bodyClassName="divide-y divide-rule"
    >
      {site.education.map((e) => (
        <div
          key={e.school}
          className="flex items-start gap-4 px-5 py-5 sm:px-6"
        >
          <Mark text={e.mark} />
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <div className="min-w-0">
              <h3 className="font-semibold">{e.school}</h3>
              <p className="text-small text-ink-muted">{e.degree}</p>
            </div>
            <p className="font-mono text-meta text-ink-muted">
              {e.period} <span className="text-ink">{e.score}</span>
            </p>
          </div>
        </div>
      ))}
      <div className="px-5 py-5 sm:px-6">
        <h3 className="font-semibold">Certifications</h3>
        <ul className="mt-2 space-y-1 text-small text-ink-muted">
          {site.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
