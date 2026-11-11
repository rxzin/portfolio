import Page, { pageMetadata } from "@/components/Page";
import Contact from "@/components/sections/Contact";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return (
    <Page href="/contact">
      <Contact />
    </Page>
  );
}
