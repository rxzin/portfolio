/** Initials tile for a company or school. `live` adds a pulsing dot for a current role. */
export default function Mark({ text, live }: { text: string; live?: boolean }) {
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center border border-rule bg-panel font-mono text-[0.75rem] font-semibold tracking-tight">
      {text}
      {live && (
        <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-bg" />
          <span className="sr-only">Current role</span>
        </span>
      )}
    </span>
  );
}
