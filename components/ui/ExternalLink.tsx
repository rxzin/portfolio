import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";

/** A link that opens in a new tab and says so: an arrow you can see, a phrase you can hear. */
export default function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${className ?? ""}`}
    >
      {children}
      <Icon
        name="arrowUpRight"
        className="ml-1 inline-block h-3 w-3 text-ink-muted transition-transform duration-200 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
