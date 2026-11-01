import SpotlightCard from "@/components/motion/SpotlightCard";
import Section from "@/components/ui/Section";
import { site } from "@/data/site";

const cell =
  "border-rule px-5 py-6 sm:px-6 [&:not(:last-child)]:border-b sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0";

export default function Services() {
  return (
    <Section id="services" title="What I build" bodyClassName="">
      <ul className="grid sm:grid-cols-2">
        {site.services.map((s) => (
          <SpotlightCard as="li" key={s.title} className={cell}>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-2 text-small text-ink-muted">{s.description}</p>
          </SpotlightCard>
        ))}
      </ul>
    </Section>
  );
}
