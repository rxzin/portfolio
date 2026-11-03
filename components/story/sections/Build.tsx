import Appear from "@/components/motion/Appear";
import { Glow, Packets } from "@/components/story/Atmosphere";
import Coral from "@/components/story/Coral";
import Chapter, { Statement } from "@/components/story/Chapter";
import { site } from "@/data/site";

const { build } = site.story;

/** "What I build": numbered list, like the reference's "Action for rescue" steps. */
export default function Build() {
  return (
    <Chapter
      id="build"
      number="02"
      label={build.label}
      headline={build.headline}
      backdrop={
        <>
          <Glow className="-left-[25vmax] top-[30%] h-[70vmax] w-[70vmax]" />
          <Coral
            file="coral-2.jpg"
            subject="branching coral on black"
            className="-left-24 top-[38%] hidden w-[30rem] rotate-90 lg:block"
          />
          <Packets
            seed={29}
            count={10}
            className="left-0 top-[40%] hidden h-[50%] w-[32%] lg:block"
          />
        </>
      }
    >
      <div className="lg:ml-[36%]">
        <Appear from="right" className="mt-12 lg:mt-16">
          <Statement className="max-w-[30rem]">{build.statement}</Statement>
        </Appear>

        <ol className="mt-10 border-t border-rule">
          {site.services.map((s, i) => (
            <Appear
              as="li"
              key={s.title}
              from="right"
              delay={0.08 * i}
              className="grid gap-x-6 gap-y-2 border-b border-rule py-7 sm:grid-cols-[3rem_minmax(0,1fr)] xl:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-x-10"
            >
              <span className="text-label font-semibold text-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-statement font-semibold uppercase">
                {s.title}
              </h3>
              <p className="text-ink-muted sm:col-start-2 xl:col-start-auto">
                {s.description}
              </p>
            </Appear>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
