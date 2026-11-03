import SpotlightCard from "@/components/motion/SpotlightCard";
import BulletList from "@/components/ui/BulletList";
import Section from "@/components/ui/Section";
import Tags from "@/components/ui/Tags";
import { site } from "@/data/site";

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      aside={String(site.projects.length)}
      bodyClassName="divide-y divide-rule"
    >
      {site.projects.map((p) => (
        <SpotlightCard
          as="article"
          key={p.id}
          id={p.id}
          className="scroll-mt-20 px-5 py-6 sm:px-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lead font-semibold">{p.title}</h3>
            <p className="font-mono text-meta text-ink-muted">{p.year}</p>
          </div>
          <p className="font-mono text-meta text-ink-muted">{p.kind}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{p.summary}</p>
          <BulletList items={p.bullets} />
          <Tags items={p.stack} />
        </SpotlightCard>
      ))}
    </Section>
  );
}
