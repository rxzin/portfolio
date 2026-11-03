import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/motion/Providers";
import { site } from "@/data/site";
import "./globals.css";

// One family, like the reference: Inter at display, statement and body sizes.
// opsz gives the giant headlines Inter's display cut; body sizes keep the text cut.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
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
  themeColor: "#060606",
};

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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from our own static data; "<" is escaped per the Next.js docs.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
        {/* Entrances start at opacity 0 and need JS to run: without it, show everything at rest. */}
        <noscript>
          <style>
            {"[style*=opacity]{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
