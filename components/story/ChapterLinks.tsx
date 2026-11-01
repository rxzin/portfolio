import { site } from "@/data/site";

/** The row of chapter names (hero top and footer), like the reference's nav. From xl (1280px):
 * narrower, seven links crowd the name, so the menu button takes over. */
export default function ChapterLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <ul
      className={`hidden flex-wrap items-center justify-between gap-x-8 gap-y-2 xl:flex ${className}`}
    >
      {site.nav.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            className="inline-block py-2 text-[0.9375rem] font-medium text-ink underline decoration-transparent underline-offset-[6px] transition-colors hover:decoration-blood-bright"
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
