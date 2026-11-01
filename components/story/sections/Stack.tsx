import Appear from "@/components/motion/Appear";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Glow } from "@/components/story/Atmosphere";
import Chapter, { Statement } from "@/components/story/Chapter";
import TechChip from "@/components/ui/TechChip";
import { site } from "@/data/site";

const { stack } = site.story;

// Black-and-white debris in the side margins. xl only: below 1280px the margins are too narrow
// and the pieces would sit under the chip lists. Pinned to the page edges at <=10% width, they
// stay outside the 64rem column (at 1280: column 128–1152px, debris 0–128 / 1152–1280).
const debris = [
  {
    file: "debris-1.jpg",
    subject: "single RJ45 network plug, black and white",
    pos: "left-0 top-[34%] w-[10%]",
    amount: 70,
  },
  {
    file: "debris-2.jpg",
    subject: "loose ribbon cable, black and white",
    pos: "right-0 top-[44%] w-[10%]",
    amount: -50,
  },
  {
    file: "debris-3.jpg",
    subject: "microchip, black and white",
    pos: "left-0 bottom-[18%] w-[8%]",
    amount: 40,
  },
  {
    file: "debris-4.jpg",
    subject: "coiled USB cable, black and white",
    pos: "right-0 bottom-[6%] w-[9%]",
    amount: -60,
  },
];

export default function Stack() {
  return (
    <Chapter
      id="stack"
      number="06"
      label={stack.label}
      headline={stack.headline}
      backdrop={
        <>
          <Glow className="left-[20%] top-[30%] h-[70vmax] w-[70vmax] opacity-60" />
          {debris.map((d) => (
            <Parallax
              key={d.file}
              amount={d.amount}
              className={`absolute hidden mix-blend-screen xl:block ${d.pos}`}
            >
              <Art
                file={d.file}
                subject={d.subject}
                ratio={1}
                sizes="10vw"
                tone="mono"
              />
            </Parallax>
          ))}
        </>
      }
    >
      <div className="mx-auto mt-12 max-w-[64rem] lg:mt-16">
        <Appear from="below">
          <Statement>{stack.statement}</Statement>
        </Appear>

        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {site.skills.map((g, i) => (
            <Appear
              key={g.label}
              from={i % 2 === 0 ? "left" : "right"}
              delay={0.06 * i}
            >
              <h3 className="border-b border-rule pb-2 text-label font-semibold uppercase text-ink-muted">
                {g.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </ul>
            </Appear>
          ))}
        </div>

        {/* education + certifications */}
        <div className="mt-20 grid gap-x-12 gap-y-10 md:grid-cols-2">
          <Appear from="left">
            <h3 className="border-b border-rule pb-2 text-label font-semibold uppercase text-ink-muted">
              Education
            </h3>
            <ul className="mt-2 divide-y divide-rule">
              {site.education.map((e) => (
                <li key={e.school} className="py-4">
                  <p className="text-statement font-semibold uppercase">
                    {e.school}
                  </p>
                  <p className="mt-1 text-ink-muted">{e.degree}</p>
                  <p className="mt-1 flex flex-wrap gap-x-4 text-label text-ink-muted">
                    <span>{e.period}</span>
                    <span className="text-ink">{e.score}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Appear>
          <Appear from="right">
            <h3 className="border-b border-rule pb-2 text-label font-semibold uppercase text-ink-muted">
              Certifications
            </h3>
            <ul className="mt-2 divide-y divide-rule">
              {site.certifications.map((c) => (
                <li key={c} className="py-4 text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </Appear>
        </div>
      </div>
    </Chapter>
  );
}
