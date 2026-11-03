import Appear from "@/components/motion/Appear";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Cross, Glow, Packets } from "@/components/story/Atmosphere";
import Coral from "@/components/story/Coral";
import Chapter, { CaseFile, Statement } from "@/components/story/Chapter";
import BulletList from "@/components/ui/BulletList";
import TechChip from "@/components/ui/TechChip";
import { type Role, site } from "@/data/site";
import { formatRange } from "@/lib/time";

const { experience } = site.story;
const role: Role = site.experience[0];

export default function Experience() {
  return (
    <Chapter
      id="experience"
      number="03"
      label={experience.label}
      headline={experience.headline}
      fade={[0]}
      backdrop={
        <>
          <Glow className="-right-[20vmax] top-[5%] h-[70vmax] w-[70vmax]" />
          <Coral
            file="coral-3.jpg"
            subject="brain coral on black"
            className="-right-32 bottom-[-4rem] w-[min(36rem,95vw)] -rotate-90"
          />
          <Packets
            seed={41}
            count={9}
            className="right-0 top-[45%] hidden h-[35%] w-[40%] lg:block"
          />
        </>
      }
      aside={
        <Parallax
          amount={50}
          className="mix-blend-screen relative mx-auto mt-10 w-full max-w-lg lg:absolute lg:-right-[2%] lg:top-[-35%] lg:mt-0 lg:w-[40%] lg:max-w-none"
        >
          <Art
            file="server-rack.jpg"
            subject="crimson metallic server rack, three-quarter view"
            ratio={2 / 3}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="max-lg:aspect-square!"
          />
        </Parallax>
      }
    >
      <Cross className="left-[55%] top-[42%] hidden lg:block" />
      <div className="mt-12 lg:mt-16 lg:max-w-[54%]">
        <Appear from="left">
          <Statement className="max-w-[36rem]">
            {experience.statement}
          </Statement>
        </Appear>

        <Appear from="below" delay={0.1} className="mt-8">
          <p className="text-statement font-semibold">{role.title}</p>
          <p className="mt-1 flex flex-wrap gap-x-4 text-label text-ink-muted">
            <span>{role.org}</span>
            <span>{formatRange(role.start, role.end)}</span>
            <span>{role.location}</span>
          </p>
          {role.summary && (
            <p className="mt-4 max-w-[36rem] text-ink-muted">{role.summary}</p>
          )}
        </Appear>

        <Appear from="left" delay={0.15} className="mt-10">
          <CaseFile title="Case file: what I shipped">
            <BulletList items={role.bullets} className="text-ink/80" />
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
              {role.stack.map((t) => (
                <TechChip key={t} name={t} />
              ))}
            </ul>
          </CaseFile>
        </Appear>
      </div>
    </Chapter>
  );
}
