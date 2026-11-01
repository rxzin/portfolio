import Cover from "@/components/Cover";
import { HeroMark } from "@/components/DotMarks";
import Icon, { type IconName } from "@/components/ui/Icon";
import LocalTime from "@/components/ui/LocalTime";
import { site } from "@/data/site";
import { getResumeHref, RESUME_DOWNLOAD_NAME } from "@/lib/resume";

// inline-block + py-1 keeps each link at least 24px tall for touch
const linkClass =
  "inline-block py-1 underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink";

function Row({
  icon,
  wide,
  children,
}: {
  icon: IconName;
  /** span both columns (for long lines) */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`flex min-w-0 items-center gap-3 ${wide ? "sm:col-span-2" : ""}`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center border border-rule bg-panel text-ink-muted">
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </li>
  );
}

/** Who I am in one glance: name, one line, and the overview facts. */
export default function Intro() {
  const github = site.socials.find((s) => s.label === "GitHub");
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");
  const resume = getResumeHref();

  return (
    <section id="top" aria-label="Introduction" className="rule-b">
      <Cover />
      {/* the dot-matrix mark overlaps the cover like a profile header */}
      <div className="rule-b flex items-end gap-5 px-5 pb-6 sm:px-6">
        <span className="relative z-[2] -mt-10 grid shrink-0 place-items-center border border-rule bg-panel p-3 shadow-[0_0_0_6px_var(--bg)] sm:-mt-12">
          <HeroMark />
        </span>
        <div className="min-w-0 pt-4">
          <h1 className="text-h1 font-semibold tracking-[-0.02em]">
            {site.name}
          </h1>
          <p className="mt-1 text-ink-muted">{site.role}</p>
        </div>
      </div>

      <p className="rule-b px-5 py-5 text-lead sm:px-6">{site.tagline}</p>

      <ul className="grid gap-x-6 gap-y-3 px-5 py-5 font-mono text-small sm:grid-cols-2 sm:px-6">
        <Row icon="briefcase" wide>
          Building AI products at {site.company}
        </Row>
        <Row icon="pin">{site.location}</Row>
        <Row icon="clock">
          <LocalTime />
        </Row>
        <Row icon="mail">
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>
        </Row>
        {github && (
          <Row icon="github">
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {github.href.replace("https://", "")}
            </a>
          </Row>
        )}
        {linkedin && (
          <Row icon="linkedin">
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </Row>
        )}
        {resume && (
          <Row icon="file">
            <a
              href={resume}
              download={RESUME_DOWNLOAD_NAME}
              className={linkClass}
            >
              Download résumé (PDF)
            </a>
          </Row>
        )}
      </ul>
    </section>
  );
}
