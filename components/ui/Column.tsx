/**
 * One centered column with side rules; sections are separated by full-width rules.
 * overflow-x-clip here (not just on body) keeps those rules from widening the page.
 */
export default function Column({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-clip px-3 sm:px-4">
      <div
        className={`mx-auto max-w-[46rem] border-x border-rule ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
