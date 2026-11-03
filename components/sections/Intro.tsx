import HeroBackground from "@/components/HeroBackground";
import CopyEmail from "@/components/ui/CopyEmail";
import ExternalLink from "@/components/ui/ExternalLink";
import Icon, { type IconName } from "@/components/ui/Icon";
import LocalTime from "@/components/ui/LocalTime";
import { site } from "@/data/site";
import { getResumeHref, RESUME_DOWNLOAD_NAME } from "@/lib/resume";

// same left edge as the logo in the nav (its padding, plus its 1px border)
const edge = "px-[33px] sm:px-[41px]";

// inline-block + py-1 keeps each link at least 24px tall for touch
const linkClass =
  "inline-block py-1 underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current";

function Fact({
  icon,
  className = "",
  children,
}: {
  icon: IconName;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li className={`flex min-w-0 items-center gap-2 ${className}`}>
      <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0 wrap-anywhere">{children}</span>
    </li>
  );
}

/** The first screen: the background, the name large on the left, and the facts in a slim strip along the bottom. */
export default function Intro() {
  const github = site.socials.find((s) => s.label === "GitHub");
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");
  const resume = getResumeHref();

  return (
    // z-2 forms its own stacking context, so the background's -z-10 stays above the page's own background
    // and the column's + marks and top rule, which start at its bottom edge, stay out of the hero
    <section
      id="top"
      aria-label="Introduction"
      className="relative z-2 flex min-h-svh flex-col"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      <div
        className={`relative flex flex-1 flex-col justify-end pb-8 pt-24 ${edge}`}
      >
        <div className="relative">
          {/* keeps the text readable over whichever background is in use */}
          <div
            aria-hidden
            className="hero-scrim absolute -inset-x-[41px] -top-24 -bottom-8 -z-1"
          />
          <h1 className="text-h1 font-semibold uppercase tracking-[-0.03em]">
            {site.name.split(" ").map((word) => (
              <span key={word} className="block">
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-lead text-ink-muted">{site.heroRole}</p>
          <p className="mt-2 max-w-measure text-lead">{site.tagline}</p>
        </div>
      </div>

      <ul
        className={`flex flex-wrap items-center gap-x-5 gap-y-1 bg-bg/75 py-2.5 font-mono text-meta backdrop-blur-md ${edge}`}
      >
        <Fact icon="briefcase">Building AI products at {site.company}</Fact>
        <Fact icon="pin">{site.location}</Fact>
        <Fact icon="clock">
          <LocalTime />
        </Fact>
        <Fact icon="mail" className="xl:ml-auto">
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>{" "}
          <CopyEmail compact />
        </Fact>
        {github && (
          <Fact icon="github">
            <ExternalLink href={github.href} className={linkClass}>
              GitHub
            </ExternalLink>
          </Fact>
        )}
        {linkedin && (
          <Fact icon="linkedin">
            <ExternalLink href={linkedin.href} className={linkClass}>
              LinkedIn
            </ExternalLink>
          </Fact>
        )}
        {resume && (
          <Fact icon="file">
            <a
              href={resume}
              download={RESUME_DOWNLOAD_NAME}
              className={linkClass}
            >
              Résumé
            </a>
          </Fact>
        )}
      </ul>
    </section>
  );
}
