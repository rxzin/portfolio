import Icon from "@/components/ui/Icon";

export interface ProjectPreviewProps {
  href: string;
  title: string;
  preview: {
    image: string;
    alt: string;
    video?: string;
  };
}

export default function ProjectPreview({
  href,
  title,
  preview,
}: ProjectPreviewProps) {
  let displayUrl = href;
  try {
    const url = new URL(href);
    displayUrl = url.hostname.replace(/^www\./, "");
  } catch {
    // fallback if href is relative or special
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-rule bg-panel transition-all duration-300 ease-out-expo hover:border-ink-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      aria-label={`Open live preview of ${title} at ${displayUrl} (opens in a new tab)`}
    >
      {/* Mock Browser Header / Chrome */}
      <div className="flex items-center justify-between border-b border-rule bg-panel/90 px-3.5 py-2 select-none">
        {/* Window controls styled to match portfolio's minimalist aesthetic */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-rule transition-colors group-hover:bg-ink-muted/40" />
          <span className="h-2 w-2 rounded-full bg-rule transition-colors group-hover:bg-ink-muted/40" />
          <span className="h-2 w-2 rounded-full bg-rule transition-colors group-hover:bg-ink-muted/40" />
        </div>

        {/* Address pill */}
        <div className="flex items-center gap-1.5 rounded-md border border-rule bg-bg px-2.5 py-0.5 font-mono text-[0.75rem] text-ink-muted transition-colors group-hover:border-ink-muted/50 group-hover:text-ink">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
            aria-hidden="true"
          />
          <span>{displayUrl}</span>
          <Icon
            name="arrowUpRight"
            className="h-3 w-3 text-ink-muted transition-transform duration-200 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          />
        </div>

        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-1 font-mono text-[0.6875rem] text-ink-muted">
          <span className="uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Preview media container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg">
        {preview.video ? (
          <video
            src={preview.video}
            poster={preview.image}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.015]"
          />
        ) : (
          <img
            src={preview.image}
            alt={preview.alt}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.015]"
            loading="lazy"
          />
        )}

        {/* Subtle hover gradient scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
