import Appear from "@/components/motion/Appear";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Cross, Glow, Packets } from "@/components/story/Atmosphere";
import Coral from "@/components/story/Coral";
import Chapter, { CaseFile, Statement } from "@/components/story/Chapter";
import BulletList from "@/components/ui/BulletList";
import TechChip from "@/components/ui/TechChip";
import { site } from "@/data/site";

const { projects } = site.story;
const [featured, ...others] = site.projects;

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
      {items.map((t) => (
        <TechChip key={t} name={t} />
      ))}
    </ul>
  );
}

export default function Projects() {
  return (
    <Chapter
      id="projects"
      number="05"
      label={projects.label}
      headline={projects.headline}
      fade={[1]}
      backdrop={
        <>
          <Glow className="-right-[22vmax] top-[25%] h-[80vmax] w-[80vmax]" />
          <Coral
            file="coral-2.jpg"
            subject="branching coral on black"
            className="-right-32 bottom-[4%] hidden w-[30rem] -rotate-90 lg:block"
          />
          <Packets
            seed={71}
            count={12}
            className="right-0 top-[50%] hidden h-[40%] w-[38%] lg:block"
          />
        </>
      }
      aside={
        <Parallax
          amount={50}
          className="mix-blend-screen relative mx-auto mt-10 w-full max-w-md lg:absolute lg:right-[2%] lg:top-[-30%] lg:mt-0 lg:w-[34%] lg:max-w-none"
        >
          <Art
            file="robot-head.jpg"
            subject="crimson metallic humanoid robot head in profile, internal mechanics visible"
            ratio={4 / 5}
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="max-lg:aspect-square!"
          />
        </Parallax>
      }
    >
      <Cross className="left-[62%] top-[30%] hidden lg:block" />
      <div className="mt-12 lg:mt-16 lg:max-w-[58%]">
        <Appear from="left">
          <Statement className="max-w-[34rem]">{projects.statement}</Statement>
        </Appear>

        {/* featured project */}
        <Appear from="below" delay={0.1} className="mt-10">
          <p className="flex flex-wrap gap-x-4 text-label text-ink-muted">
            <span>{featured.kind}</span>
            <span>{featured.year}</span>
          </p>
          <h3 className="mt-2 text-[clamp(1.5rem,1rem+1.8vw,2.5rem)] font-bold uppercase leading-[1] tracking-[-0.02em]">
            {featured.title}
          </h3>
          <p className="mt-4 max-w-[38rem] text-ink-muted">
            {featured.summary}
          </p>
        </Appear>
        <Appear from="left" delay={0.15} className="mt-8">
          <CaseFile title="Under the hood">
            <BulletList items={featured.bullets} className="text-ink/80" />
            <Chips items={featured.stack} />
          </CaseFile>
        </Appear>

        {/* the rest, quieter */}
        {others.map((p) => (
          <Appear
            key={p.id}
            from="below"
            className="mt-12 border-t border-rule pt-8"
          >
            <p className="flex flex-wrap gap-x-4 text-label text-ink-muted">
              <span>{p.kind}</span>
              <span>{p.year}</span>
            </p>
            <h3 className="mt-2 text-statement font-semibold uppercase">
              {p.title}
            </h3>
            <p className="mt-3 max-w-[38rem] text-ink-muted">{p.summary}</p>
            <BulletList items={p.bullets} />
            <Chips items={p.stack} />
          </Appear>
        ))}
      </div>
    </Chapter>
  );
}
