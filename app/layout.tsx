import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Instrument_Sans,
  JetBrains_Mono,
  Mukta,
} from "next/font/google";
import Providers from "@/components/motion/Providers";
import Nav from "@/components/Nav";
import { site } from "@/data/site";
import "./globals.css";

// Instrument Sans for reading; JetBrains Mono for dates, durations and other data.
const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// The hero's own pair (see Intro.tsx).
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.url }],
  keywords: [
    "Full-Stack Engineer",
    "Full-Stack AI Engineer",
    "LLM agents",
    "RAG",
    "TypeScript",
    "Python",
    "NestJS",
    "FastAPI",
    "LangGraph",
    site.name,
  ],
  openGraph: {
    type: "profile",
    url: "/",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ebee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1217" },
  ],
};

// Runs before first paint: saved choice, else the system setting. Prevents a light→dark flash.
// Also marks that JS is running, which is what allows sections to start hidden (see globals.css).
const themeScript = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

// Structured data so search engines understand who this page is about.
const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.name,
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      url: site.url,
      name: title,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      alternateName: site.alternateName,
      url: site.url,
      jobTitle: site.role,
      description: site.description,
      email: `mailto:${site.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressCountry: "IN",
      },
      worksFor: { "@type": "Organization", name: site.experience[0].org },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: site.education[0].school,
      },
      knowsAbout: site.skills.flatMap((g) => g.items),
      sameAs: site.socials.map((s) => s.href),
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script adds "dark" to this element before React hydrates
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${plexMono.variable} ${mukta.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script we wrote; no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from our own static data; "<" is escaped per the Next.js docs.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:bg-ink focus:px-4 focus:py-2 focus:text-panel"
          >
            Skip to content
          </a>
          <Nav />

          <main id="content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
