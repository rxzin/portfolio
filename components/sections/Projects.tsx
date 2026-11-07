import SpotlightCard from "@/components/motion/SpotlightCard";
import BulletList from "@/components/ui/BulletList";
import Icon from "@/components/ui/Icon";
import ProjectPreview from "@/components/ui/ProjectPreview";
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
            <h3 className="text-lead font-semibold">
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                >
                  <span>{p.title}</span>
                  <Icon
                    name="arrowUpRight"
                    className="h-3.5 w-3.5 text-ink-muted transition-transform duration-200 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-accent"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                p.title
              )}
            </h3>
            <p className="font-mono text-meta text-ink-muted">{p.year}</p>
          </div>
          <p className="font-mono text-meta text-ink-muted">{p.kind}</p>
          <p className="mt-3 max-w-measure text-ink-muted">{p.summary}</p>
          {p.preview && (
            <div className="mt-4 max-w-2xl">
              <ProjectPreview
                href={p.href ?? "#"}
                title={p.title}
                preview={p.preview}
              />
            </div>
          )}
          <BulletList items={p.bullets} />
          <Tags items={p.stack} />
        </SpotlightCard>
      ))}
    </Section>
  );
}
