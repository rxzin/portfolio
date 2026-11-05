import Section from "@/components/ui/Section";
import { site } from "@/data/site";
import { rich } from "@/lib/rich";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-measure space-y-4 text-ink-muted [&_strong]:text-ink">
        {site.about.map((p) => (
          <p key={p}>{rich(p)}</p>
        ))}
      </div>
    </Section>
  );
}
