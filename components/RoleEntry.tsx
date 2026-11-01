import BulletList from "@/components/ui/BulletList";
import Mark from "@/components/ui/Mark";
import Tags from "@/components/ui/Tags";
import type { Role } from "@/data/site";
import { formatDuration, formatRange } from "@/lib/time";

/** One job or internship: where, what, when, then the details. */
export default function RoleEntry({ role }: { role: Role }) {
  return (
    <article id={role.id} className="scroll-mt-20 px-5 py-6 sm:px-6">
      <header className="flex items-start gap-4">
        <Mark text={role.mark} live={!role.end} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lead font-semibold">{role.org}</h3>
            <p className="font-mono text-meta text-ink-muted">
              {role.location}
            </p>
          </div>
          <p className="font-medium">{role.title}</p>
          <p className="mt-1 font-mono text-meta text-ink-muted">
            {formatRange(role.start, role.end)}
            {role.end && <> ({formatDuration(role.start, role.end)})</>}
          </p>
        </div>
      </header>
      {role.summary && <p className="mt-4 text-ink-muted">{role.summary}</p>}
      <BulletList items={role.bullets} />
      <Tags items={role.stack} />
    </article>
  );
}
