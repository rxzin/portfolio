import Appear from "@/components/motion/Appear";
import CountUp from "@/components/motion/CountUp";
import { Glow } from "@/components/story/Atmosphere";
import Coral from "@/components/story/Coral";
import Chapter, { CaseFile, Statement } from "@/components/story/Chapter";
import { site } from "@/data/site";
import { rich } from "@/lib/rich";

const { about } = site.story;

export default function About() {
  return (
    <Chapter
      id="about"
      number="01"
      label={about.label}
      headline={about.headline}
      fade={[1]}
      backdrop={
        <>
          <Glow className="-right-[25vmax] top-[15%] h-[75vmax] w-[75vmax]" />
          <Coral
            file="coral-1.jpg"
            subject="red finger coral on black"
            className="-right-24 bottom-[-10rem] hidden w-[30rem] -rotate-90 lg:block"
          />
        </>
      }
    >
      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Appear from="left">
            <Statement className="max-w-[32rem]">{about.statement}</Statement>
          </Appear>
          <Appear
            from="below"
            delay={0.15}
            className="mt-6 max-w-[34rem] space-y-4 text-ink-muted [&_strong]:text-ink"
          >
            {site.about.map((p) => (
              <p key={p}>{rich(p)}</p>
            ))}
          </Appear>
        </div>

        <Appear
          from="right"
          delay={0.1}
          className="lg:col-span-5 lg:col-start-8"
        >
          <CaseFile title="By the numbers">
            {/* only the number is large; prefix/suffix stay small so long stats ("98 of 113") never overflow */}
            <dl className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {site.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex min-w-0 flex-col-reverse justify-end"
                >
                  <dt className="mt-2 text-label text-ink/75">{s.label}</dt>
                  {/* spacing comes from the data: "Top " and " of 113" carry a space, "+" hugs the number */}
                  <dd className="font-bold uppercase tracking-[-0.04em] text-ink">
                    {s.prefix && (
                      <span className="text-statement">{s.prefix}</span>
                    )}
                    <span className="text-numeral tabular-nums">
                      <CountUp value={s.value} decimals={s.decimals} />
                    </span>
                    {s.suffix && (
                      <span className="text-statement">{s.suffix}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </CaseFile>
        </Appear>
      </div>
    </Chapter>
  );
}
