import type { Metadata } from "next";
import FerrofluidBand from "@/components/FerrofluidBand";
import Column from "@/components/ui/Column";
import ExternalLink from "@/components/ui/ExternalLink";
import { Gap } from "@/components/ui/Section";
import { site } from "@/data/site";

type Href = (typeof site.nav)[number]["href"];

const find = (href: Href) =>
  site.nav.find((p) => p.href === href) as (typeof site.nav)[number];

/** Title, description and canonical URL for one of the pages in site.nav. */
export function pageMetadata(href: Href): Metadata {
  const { label, description } = find(href);
  const title = `${label} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      type: "profile",
      url: href,
      title,
      description,
      siteName: site.name,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** A page after the home page: its title under the nav, its sections in the ruled column, then the animated band and the footer. */
export default function Page({
  href,
  children,
}: {
  href: Href;
  children: React.ReactNode;
}) {
  return (
    // pt-14 clears the fixed nav
    <div className="pt-14">
      <Column>
        <h1 className="px-5 py-8 text-stat font-semibold tracking-[-0.02em] sm:px-6">
          {find(href).label}
        </h1>
        {children}
        <Gap />
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
                href="#content"
                className="inline-block py-1 transition-colors hover:text-ink"
              >
                Back to top
              </a>
            </li>
          </ul>
        </footer>
      </Column>
    </div>
  );
}
