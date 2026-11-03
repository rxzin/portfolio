import FerrofluidBand from "@/components/FerrofluidBand";
import Nav from "@/components/Nav";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Intro from "@/components/sections/Intro";
import Numbers from "@/components/sections/Numbers";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Stack from "@/components/sections/Stack";
import ExternalLink from "@/components/ui/ExternalLink";
import { Gap } from "@/components/ui/Section";
import { site } from "@/data/site";

/**
 * One centered column with side rules; sections are separated by full-width rules.
 * overflow-x-clip here (not just on body) keeps those rules from widening the page.
 * The hero sits outside it, so it carries no grid lines.
 */
function Column({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-clip px-3 sm:px-4">
      <div
        className={`mx-auto max-w-[46rem] border-x border-rule ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:bg-ink focus:px-4 focus:py-2 focus:text-panel"
      >
        Skip to content
      </a>
      <Nav />

      <main>
        {/* The story: who I am → my path → proof → what I build → where → how to reach me */}
        <Intro />
        <Column className="rule-t">
          <About />
          <Numbers />
          <Services />
          <Experience
            id="experience"
            title="Experience"
            roles={site.experience}
          />
          <Experience
            id="internships"
            title="Internships"
            roles={site.internships}
          />
          <Projects />
          <Stack />
          <Education />
          <Contact />
          <Gap />
        </Column>
      </main>

      <Column>
        <FerrofluidBand />
        <Gap marks="bottom" />

        <footer className="rule-t flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 font-mono text-meta text-ink-muted sm:px-6">
          <p>© 2026 {site.name}</p>
          <ul className="flex flex-wrap gap-x-5">
            {site.socials.map((s) => (
              <li key={s.label}>
                <ExternalLink
                  href={s.href}
                  className="inline-block py-1 transition-colors hover:text-ink"
                >
                  {s.label}
                </ExternalLink>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="inline-block py-1 transition-colors hover:text-ink"
              >
                Back to top
              </a>
            </li>
          </ul>
        </footer>
      </Column>
    </>
  );
}
