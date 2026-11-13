import type { Benchmark } from "@/data/site";

/** A small results table: the setup above it, how it was measured below. */
export default function BenchmarkTable({
  benchmark,
}: {
  benchmark: Benchmark;
}) {
  const [first, ...rest] = benchmark.columns;
  return (
    <figure className="max-w-measure">
      <figcaption className="font-mono text-meta text-ink-muted">
        {benchmark.caption}
      </figcaption>
      <div className="mt-2 overflow-x-auto border border-rule bg-panel">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr className="border-b border-rule font-mono text-meta text-ink-muted">
              <th
                scope="col"
                className="px-2 py-2 sm:px-3 text-left font-normal"
              >
                {first}
              </th>
              {rest.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-2 py-2 sm:px-3 text-right font-normal"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {benchmark.rows.map(([label, ...values]) => (
              <tr key={label}>
                <th
                  scope="row"
                  className="px-2 py-2 sm:px-3 text-left font-normal"
                >
                  {label}
                </th>
                {values.map((v, i) => (
                  <td
                    // biome-ignore lint/suspicious/noArrayIndexKey: columns are fixed per table
                    key={i}
                    className="whitespace-nowrap px-2 py-2 sm:px-3 text-right font-mono tabular-nums text-ink"
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-small text-ink-muted">{benchmark.note}</p>
    </figure>
  );
}
