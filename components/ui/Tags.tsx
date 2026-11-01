import TechChip from "@/components/ui/TechChip";

/** Tech used on a role or project. */
export default function Tags({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
      {items.map((t) => (
        <TechChip key={t} name={t} />
      ))}
    </ul>
  );
}
