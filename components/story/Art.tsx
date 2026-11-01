import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

interface ArtProps {
  /** file name inside public/newui/ (see docs/newui-assets.md) */
  file: string;
  /** what to generate, shown on the placeholder */
  subject: string;
  /** width / height of the render, e.g. 3/2; the box keeps this ratio so nothing shifts */
  ratio?: number;
  /** responsive `sizes` for next/image */
  sizes: string;
  /** color treatment (SVG filters in ToneFilters.tsx) */
  tone?: "crimson" | "mono";
  priority?: boolean;
  className?: string;
}

// Soft edge so the photo's rectangle disappears and it reads as a cutout.
const EDGE_MASK =
  "radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)";

/**
 * A story image. Uses public/newui/<file> when it exists (rebuild after adding it); otherwise a
 * labeled placeholder of the same size. Decorative: alt is empty.
 * For the dark background to vanish, the nearest transformed ancestor (the Parallax wrapper)
 * needs `mix-blend-screen`: a transform isolates blending, so it must sit on that wrapper.
 */
export default function Art({
  file,
  subject,
  ratio = 3 / 2,
  sizes,
  priority,
  tone = "crimson",
  className = "",
}: ArtProps) {
  const exists = existsSync(join(process.cwd(), "public", "newui", file));

  return (
    <div
      aria-hidden="true"
      className={`relative ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {exists ? (
        <Image
          src={`/newui/${file}`}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="pointer-events-none object-cover"
          style={{
            filter: `url(#tone-${tone})`,
            maskImage: EDGE_MASK,
            WebkitMaskImage: EDGE_MASK,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="@container absolute inset-0 grid place-items-center overflow-hidden border border-dashed border-rule p-3 text-center [background:radial-gradient(closest-side,color-mix(in_oklab,var(--blood)_70%,transparent),transparent)]"
        >
          <div className="max-w-[16rem]">
            <p className="text-label font-semibold uppercase text-ink [overflow-wrap:anywhere]">
              {file}
            </p>
            {/* the description only where the box is roomy enough (small debris boxes show the name only) */}
            <p className="mt-1 hidden text-label text-ink-muted @[12rem]:block">
              Add: {subject}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
