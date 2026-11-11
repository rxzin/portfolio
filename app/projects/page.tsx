import Page, { pageMetadata } from "@/components/Page";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";

export const metadata = pageMetadata("/projects");

export default function ProjectsPage() {
  return (
    <Page href="/projects">
      <Projects />
      <Services />
      <Process />
    </Page>
  );
}
