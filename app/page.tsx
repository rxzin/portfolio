import Menu from "@/components/story/Menu";
import About from "@/components/story/sections/About";
import Build from "@/components/story/sections/Build";
import Experience from "@/components/story/sections/Experience";
import Finale from "@/components/story/sections/Finale";
import Hero from "@/components/story/sections/Hero";
import Internships from "@/components/story/sections/Internships";
import Projects from "@/components/story/sections/Projects";
import Stack from "@/components/story/sections/Stack";
import ToneFilters from "@/components/story/ToneFilters";

/** Variant "newui": a cinematic longread told in chapters (01–06), then the sign-off. */
export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <ToneFilters />
      <Menu />
      <Hero />
      <main>
        <About />
        <Build />
        <Experience />
        <Internships />
        <Projects />
        <Stack />
      </main>
      <Finale />
    </>
  );
}
