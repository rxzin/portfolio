import Magnetic from "@/components/motion/Magnetic";
import CopyEmail from "@/components/ui/CopyEmail";
import Icon from "@/components/ui/Icon";
import ResumeLink from "@/components/ui/ResumeLink";
import Section from "@/components/ui/Section";
import { site } from "@/data/site";

const button =
  "inline-flex h-11 items-center gap-2 px-4 text-small font-semibold transition-colors";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-[34rem] text-lead font-semibold">
        {site.contact.heading}
      </p>
      <p className="mt-2 max-w-[34rem] text-ink-muted">{site.contact.body}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Magnetic strength={0.2}>
          <a
            href={`mailto:${site.email}`}
            className={`${button} bg-ink text-panel hover:bg-accent`}
          >
            <Icon name="mail" />
            Email me
          </a>
        </Magnetic>
        <CopyEmail />
        <ResumeLink
          download
          className={`${button} border border-ink hover:bg-ink hover:text-panel`}
        >
          <Icon name="file" />
          Download résumé
        </ResumeLink>
      </div>
    </Section>
  );
}
