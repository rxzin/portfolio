import { Fragment, type ReactNode } from "react";

/** Renders `**text**` inside content strings as emphasis. */
export function rich(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a static string and never reorder
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        // biome-ignore lint/suspicious/noArrayIndexKey: same as above
        <Fragment key={i}>{part}</Fragment>
      ),
    );
}
