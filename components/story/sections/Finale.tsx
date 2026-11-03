import Image from "next/image";
import Appear from "@/components/motion/Appear";
import Magnetic from "@/components/motion/Magnetic";
import Parallax from "@/components/motion/Parallax";
import Art from "@/components/story/Art";
import { Cross, Glow, Packets } from "@/components/story/Atmosphere";
import { container } from "@/components/story/Chapter";
import Display from "@/components/story/Display";
import CopyEmail from "@/components/ui/CopyEmail";
import Icon, { type IconName } from "@/components/ui/Icon";
import { site } from "@/data/site";
import { getResumeHref, RESUME_DOWNLOAD_NAME } from "@/lib/resume";

const { finale } = site.story;

/** Square icon link, like the reference's social squares. */
function Square({
  href,
  label,
  icon,
  download,
}: {
  href: string;
  label: string;
  icon: IconName;
  download?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="grid h-12 w-12 place-items-center border border-ink transition-colors hover:bg-ink hover:text-bg"
    >
      <Icon name={icon} className="h-5 w-5" />
    </a>
  );
}

export default function Finale() {
  const github = site.socials.find((s) => s.label === "GitHub");
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");
  const resume = getResumeHref();

  return (
    <footer id="contact" className="relative overflow-x-clip pt-20 sm:pt-28">
      <Glow className="-right-[20vmax] -top-[10vmax] h-[70vmax] w-[70vmax]" />
      <Packets
        seed={89}
        count={20}
        shark={false}
        className="inset-x-0 top-24 hidden h-[28rem] lg:block"
      />

      <div className={`relative ${container}`}>
        {/* back to top */}
        <div className="flex items-center justify-between gap-8">
          <a
            href="#top"
            className="ml-auto grid h-12 w-12 shrink-0 place-items-center border border-rule transition-colors hover:border-ink"
          >
            <span className="sr-only">Back to top</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m6 15 6-6 6 6" />
            </svg>
          </a>
        </div>

        {/* credit + squares */}
        <Appear from="right" className="mt-20 sm:mt-28 lg:ml-[50%] lg:mt-64">
          <p className="max-w-[16rem] text-ink-muted">
            Full-stack AI engineer, building agents and the backends that hold
            them together
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <p className="text-statement font-semibold uppercase">
              {site.name}
            </p>
            <div className="flex gap-2">
              <Square
                href={`mailto:${site.email}`}
                label={`Email ${site.email}`}
                icon="mail"
              />
              {github && (
                <Square href={github.href} label="GitHub" icon="github" />
              )}
              {linkedin && (
                <Square href={linkedin.href} label="LinkedIn" icon="linkedin" />
              )}
              {resume && (
                <Square
                  href={resume}
                  label="Download résumé"
                  icon="file"
                  download={RESUME_DOWNLOAD_NAME}
                />
              )}
            </div>
          </div>
        </Appear>

        {/* the sign-off */}
        <div className="relative mt-8">
          <Cross className="left-[72%] top-[4%] hidden sm:block" />
          <Display
            id="contact-title"
            lines={finale.headline}
            fade={[1]}
            className="relative z-10"
          />
          {/* above the headline on lg, kept clear of it: white text over pale blue would be hard to read */}
          <Image
            src="/newui/octopus.png"
            alt=""
            width={658}
            height={785}
            sizes="(min-width: 1024px) 21rem, 18rem"
            className="pointer-events-none relative mx-auto mt-10 w-full max-w-[18rem] lg:absolute lg:bottom-full lg:left-[6%] lg:mx-0 lg:mb-3 lg:mt-0 lg:w-[21rem] lg:max-w-none"
          />
          <Parallax
            amount={40}
            className="mix-blend-screen hidden lg:absolute lg:block lg:-right-[2%] lg:top-[-25%] lg:mt-0 lg:w-[34%] lg:max-w-none"
          >
            <Art
              file="cable-tangle.jpg"
              subject="black and white octopus-like tangle of network cables with plugs"
              ratio={1}
              tone="mono"
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </Parallax>
        </div>

        {/* contact */}
        <div className="relative z-10 mt-12 grid gap-8 pb-16 lg:grid-cols-12 lg:items-end">
          <Appear from="left" className="lg:col-span-5">
            <p className="text-statement font-semibold uppercase">
              {site.contact.heading}
            </p>
            <p className="mt-3 max-w-[30rem] text-ink-muted">
              {site.contact.body}
            </p>
          </Appear>
          <Appear
            from="right"
            delay={0.1}
            className="flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end"
          >
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-12 items-center bg-ink px-5 text-label font-semibold uppercase text-bg transition-colors hover:bg-blood-bright hover:text-ink"
              >
                Email me
              </a>
            </Magnetic>
            <CopyEmail />
          </Appear>
        </div>
      </div>

      <div className="relative border-t border-rule">
        <div
          className={`${container} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 text-label text-ink-muted`}
        >
          <p>© 2026 {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
