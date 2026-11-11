import Link from "next/link";
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

/** The home page: the background, the greeting, name, role, tagline and page buttons stacked on the left and centered vertically, and the facts in a slim strip along the bottom. */
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
        className={`relative flex flex-1 flex-col justify-center pb-12 pt-24 ${edge}`}
      >
        {/* Type sizes, weights and line heights follow the reference hero: one set up to 980px, a larger one above. */}
        <div className="relative">
          {/* keeps the text readable over whichever background is in use */}
          <div
            aria-hidden
            className="hero-scrim absolute -inset-x-[41px] -inset-y-24 -z-1"
          />
          <p className="font-hero-mono text-[1.125rem] leading-7 font-semibold text-accent min-[981px]:text-[1.25rem] min-[981px]:leading-10">
            {site.heroGreeting}
          </p>
          <h1 className="font-hero-mono py-2.5 text-[2.5rem] leading-none font-bold min-[981px]:text-[4.5rem]">
            {site.name}
          </h1>
          <p className="font-hero-sans mt-2 text-[1.25rem] leading-6 font-bold text-ink-muted min-[981px]:mt-4 min-[981px]:text-[3.75rem] min-[981px]:leading-16">
            {site.heroRole}
          </p>
          <p className="font-hero-mono mt-6 max-w-[50rem] text-[1rem] leading-6 font-medium min-[981px]:text-[1.125rem] min-[981px]:leading-[1.5]">
            {site.tagline}
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {site.nav.map((page, i) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className={`font-hero-sans inline-flex items-center gap-2 px-5 py-3 text-[1rem] leading-6 font-semibold transition active:scale-[0.98] min-[981px]:px-8 min-[981px]:py-4 min-[981px]:text-[1.25rem] min-[981px]:leading-4 ${
                    i === 0
                      ? "border border-ink bg-ink text-panel hover:border-accent hover:bg-accent"
                      : "border border-ink hover:bg-ink hover:text-panel"
                  }`}
                >
                  {page.label}
                  {i === 0 && <Icon name="chevronRight" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul
        className={`flex flex-wrap items-center gap-x-5 gap-y-1 bg-bg/75 py-2.5 font-mono text-meta backdrop-blur-md pointer-coarse:bg-bg/90 pointer-coarse:backdrop-blur-none ${edge}`}
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
