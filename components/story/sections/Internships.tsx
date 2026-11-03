import Appear from "@/components/motion/Appear";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Glow, Packets } from "@/components/story/Atmosphere";
import Coral from "@/components/story/Coral";
import Chapter, { CaseFile, Statement } from "@/components/story/Chapter";
import BulletList from "@/components/ui/BulletList";
import TechChip from "@/components/ui/TechChip";
import { site } from "@/data/site";
import { formatDuration, formatRange } from "@/lib/time";

const { internships } = site.story;

/** Mirrored composition: headline right, render left, content right. */
export default function Internships() {
  return (
    <Chapter
      id="internships"
      number="04"
      label={internships.label}
      headline={internships.headline}
      fade={[1]}
      headlineClassName="lg:text-right"
      backdrop={
        <>
          <Glow className="-left-[25vmax] top-[20%] h-[75vmax] w-[75vmax]" />
          <Coral
            file="coral-1.jpg"
            subject="red finger coral on black"
            className="-left-36 top-[45%] w-[min(32rem,90vw)] rotate-90"
          />
          <Packets
            seed={59}
            count={10}
            className="left-0 top-[20%] hidden h-[40%] w-[44%] lg:block"
          />
        </>
      }
      aside={
        <Parallax
          amount={45}
          className="mix-blend-screen relative mx-auto mt-10 w-full max-w-xl lg:absolute lg:-left-[4%] lg:top-[-10%] lg:mt-0 lg:w-[46%] lg:max-w-none"
        >
          <Art
            file="satellite.jpg"
            subject="crimson metallic earth-observation satellite, panels unfolded"
            sizes="(min-width: 1024px) 46vw, 100vw"
          />
        </Parallax>
      }
    >
      <div className="mt-12 lg:ml-[48%] lg:mt-16">
        <Appear from="right">
          <Statement className="max-w-[34rem]">
            {internships.statement}
          </Statement>
        </Appear>

        <div className="mt-10 grid gap-6">
          {site.internships.map((r, i) => (
            <Appear key={r.id} from="right" delay={0.1 * i}>
              <CaseFile title={r.org}>
                <p className="font-semibold text-ink">{r.title}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 text-label text-ink/75">
                  <span>{formatRange(r.start, r.end)}</span>
                  {r.end && <span>{formatDuration(r.start, r.end)}</span>}
                  <span>{r.location}</span>
                </p>
                <BulletList items={r.bullets} className="text-ink/80" />
                <ul
                  className="mt-6 flex flex-wrap gap-1.5"
                  aria-label="Built with"
                >
                  {r.stack.map((t) => (
                    <TechChip key={t} name={t} />
                  ))}
                </ul>
              </CaseFile>
            </Appear>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
