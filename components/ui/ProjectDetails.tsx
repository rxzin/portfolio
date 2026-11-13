import BenchmarkTable from "@/components/ui/BenchmarkTable";
import { Bullet } from "@/components/ui/BulletList";
import type { Benchmark, ProjectSection } from "@/data/site";

function Heading({ children }: { children: string }) {
  return <h4 className="font-mono text-meta text-ink">{children}</h4>;
}

/** Project details grouped under headings, all visible, with an optional benchmark. */
export default function ProjectDetails({
  sections,
  benchmark,
}: {
  sections: ProjectSection[];
  benchmark?: Benchmark;
}) {
  return (
    <div className="mt-4 max-w-measure space-y-5 text-ink-muted">
      {sections.map((s) => (
        <section key={s.label}>
          <Heading>{s.label}</Heading>
          <ul className="mt-2 space-y-2">
            {s.bullets.map((b) => (
              <Bullet key={b} text={b} />
            ))}
          </ul>
        </section>
      ))}
      {benchmark && (
        <section>
          <Heading>Performance</Heading>
          <div className="mt-2">
            <BenchmarkTable benchmark={benchmark} />
          </div>
        </section>
      )}
    </div>
  );
}
