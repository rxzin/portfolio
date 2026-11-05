import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "assets", "fonts");
const sans = await readFile(join(fonts, "InstrumentSans-SemiBold.ttf"));
const mono = await readFile(join(fonts, "JetBrainsMono-Regular.ttf"));

/** The picture shown when the site is shared: the hero's name and role on the dark theme. */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#e4e8ee",
        backgroundColor: "#0e1217",
        backgroundImage:
          "radial-gradient(circle at 88% 0%, rgba(124, 156, 255, 0.34), rgba(14, 18, 23, 0) 58%)",
        fontFamily: "Instrument Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "JetBrains Mono",
          fontSize: 26,
          color: "#95a0ae",
        }}
      >
        <span>{new URL(site.url).host}</span>
        <span>{site.location}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          {site.name.split(" ").map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
        <div style={{ marginTop: 28, fontSize: 44, color: "#7c9cff" }}>
          {site.role}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Instrument Sans", data: sans, weight: 600 },
        { name: "JetBrains Mono", data: mono, weight: 400 },
      ],
    },
  );
}
