const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2026-04" -> months since year 0, so ranges can be measured and positioned. */
export function toMonths(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function label(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "Feb–May 2025", "Jun 2024–Jan 2025", "Apr 2026 to now" */
export function formatRange(start: string, end?: string): string {
  if (!end) return `${label(start)} to now`;
  const [sy] = start.split("-");
  const [ey] = end.split("-");
  if (sy === ey) return `${label(start).split(" ")[0]}–${label(end)}`;
  return `${label(start)}–${label(end)}`;
}

/** Inclusive length of a finished range: "2 months", "1 year 3 months". */
export function formatDuration(start: string, end: string): string {
  const total = toMonths(end) - toMonths(start) + 1;
  const y = Math.floor(total / 12);
  const m = total % 12;
  const part = (n: number, unit: string) =>
    n ? `${n} ${unit}${n > 1 ? "s" : ""}` : "";
  return [part(y, "year"), part(m, "month")].filter(Boolean).join(" ");
}
