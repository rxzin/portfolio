import { techIcon } from "@/lib/tech-icons";

/** A technology name with its brand icon when one exists. */
export default function TechChip({ name }: { name: string }) {
  const icon = techIcon(name);
  return (
    <li className="inline-flex items-center gap-1.5 border border-rule bg-panel px-2 py-1 font-mono text-[0.75rem] leading-none transition-colors hover:border-ink-muted">
      {icon && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          fill={icon.color}
        >
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </li>
  );
}
