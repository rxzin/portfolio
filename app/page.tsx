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
import { Gap } from "@/components/ui/Section";
import { site } from "@/data/site";

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

      {/* One centered column with side rules; sections are separated by full-width rules.
          overflow-x-clip here (not just on body) keeps those rules from widening the page. */}
      <div className="overflow-x-clip px-3 sm:px-4">
        <div className="mx-auto max-w-[46rem] border-x border-rule pt-14">
          <main>
            {/* The story: who I am → my path → proof → what I build → where → how to reach me */}
            <Intro />
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
          </main>

          <Gap />

          <footer className="rule-t flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 font-mono text-meta text-ink-muted sm:px-6">
            <p>© 2026 {site.name}</p>
            <ul className="flex gap-5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
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
        </div>
      </div>
    </>
  );
}
