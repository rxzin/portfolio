import Section from "@/components/ui/Section";
import TechChip from "@/components/ui/TechChip";
import { site } from "@/data/site";

export default function Stack() {
  return (
    <Section id="stack" title="Stack" bodyClassName="divide-y divide-rule">
      {site.skills.map((g) => (
        <div
          key={g.label}
          className="grid gap-2 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-6"
        >
          <h3 className="font-mono text-meta text-ink-muted sm:pt-1">
            {g.label}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {g.items.map((t) => (
              <TechChip key={t} name={t} />
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
