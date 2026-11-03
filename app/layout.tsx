import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/motion/Providers";
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

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  title,
  description: site.description,
  authors: [{ name: site.name }],
  keywords: [
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
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
  },
  twitter: { card: "summary", title, description: site.description },
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
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: site.experience[0].org },
  alumniOf: { "@type": "CollegeOrUniversity", name: site.education[0].school },
  knowsAbout: site.skills.find((g) => g.label === "AI and LLM")?.items,
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script adds "dark" to this element before React hydrates
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} antialiased`}
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
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
