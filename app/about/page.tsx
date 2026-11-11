import Page, { pageMetadata } from "@/components/Page";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Numbers from "@/components/sections/Numbers";
import Stack from "@/components/sections/Stack";
import { site } from "@/data/site";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <Page href="/about">
      <About />
      <Numbers />
      <Experience id="experience" title="Experience" roles={site.experience} />
      <Experience
        id="internships"
        title="Internships"
        roles={site.internships}
      />
      <Stack />
      <Education />
    </Page>
  );
}
