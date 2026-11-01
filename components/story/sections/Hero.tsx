import { NavMark } from "@/components/DotMarks";
import Appear from "@/components/motion/Appear";
import Magnetic from "@/components/motion/Magnetic";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Cross, Glow, Packets } from "@/components/story/Atmosphere";
import { container, Statement } from "@/components/story/Chapter";
import ChapterLinks from "@/components/story/ChapterLinks";
import Display from "@/components/story/Display";
import ResumeLink from "@/components/ui/ResumeLink";
import { site } from "@/data/site";

const { hero } = site.story;

export default function Hero() {
  return (
    <header id="top" className="relative overflow-x-clip pb-20 sm:pb-28">
      {/* atmosphere */}
      <Glow className="left-[10%] top-[10%] h-[80vmax] w-[80vmax] sm:left-[25%]" />
      <Glow className="-left-[30vmax] bottom-[-20vmax] h-[60vmax] w-[60vmax] opacity-60" />
      <Packets
        seed={7}
        count={12}
        className="inset-x-0 top-[26%] h-[26%] md:right-auto md:top-[58%] md:h-[36%] md:w-1/2"
      />
      <Packets
        seed={19}
        count={8}
        className="right-0 top-[12%] hidden h-[30%] w-1/2 md:block"
      />

      <div className={`relative ${container} pt-5 sm:pt-7`}>
        {/* top row: mark + name, chapter links (desktop) */}
        <div className="flex items-center justify-between gap-8 pr-16 xl:pr-0">
          <a href="#top" className="flex shrink-0 items-center gap-3 py-1">
            <NavMark />
            <span className="text-[0.9375rem] font-semibold uppercase tracking-tight">
              {site.name}
            </span>
          </a>
          <ChapterLinks className="w-full max-w-[52rem]" />
        </div>

        <div className="relative mt-16 sm:mt-24 lg:mt-28">
          <Cross className="left-[38%] top-[8%] hidden sm:block" />
          <Display
            as="h1"
            lines={hero.headline}
            fade={[1]}
            className="relative z-10"
          />

          {/* the render: in flow on phones (after the headline), behind the headline's right side on lg */}
          <Parallax
            amount={40}
            className="mix-blend-screen relative z-0 mx-auto mt-10 w-full max-w-xl lg:absolute lg:-right-[3%] lg:top-1/2 lg:mt-0 lg:w-[54%] lg:max-w-none lg:-translate-y-1/2"
          >
            <Art
              file="hero-hand.jpg"
              subject="crimson metallic robotic hand reaching forward"
              sizes="(min-width: 1024px) 54vw, 100vw"
              priority
            />
          </Parallax>
        </div>

        <div className="relative z-10 mt-12 lg:ml-[50%] lg:mt-16 lg:max-w-[30rem]">
          <Appear from="right" delay={0.5}>
            <Statement>{hero.statement}</Statement>
            <p className="mt-4 max-w-[26rem] text-ink-muted">{hero.note}</p>
          </Appear>
          <Appear
            from="below"
            delay={0.7}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-12 items-center bg-ink px-5 text-label font-semibold uppercase text-bg transition-colors hover:bg-blood-bright hover:text-ink"
              >
                Email me
              </a>
            </Magnetic>
            <ResumeLink
              download
              className="inline-flex h-12 items-center border border-rule px-5 text-label font-semibold uppercase transition-colors hover:border-ink"
            >
              Download résumé
            </ResumeLink>
          </Appear>
        </div>
      </div>
    </header>
  );
}
