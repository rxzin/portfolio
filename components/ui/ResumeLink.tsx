import type { ReactNode } from "react";
import { getResumeHref, RESUME_DOWNLOAD_NAME } from "@/lib/resume";

interface ResumeLinkProps {
  children: ReactNode;
  className?: string;
  /** save the file instead of opening it in a new tab */
  download?: boolean;
}

/** Links to whatever PDF is in public/resume/. Renders nothing if there isn't one. */
export default function ResumeLink({
  children,
  className,
  download,
}: ResumeLinkProps) {
  const href = getResumeHref();
  if (!href) return null;

  return download ? (
    <a href={href} download={RESUME_DOWNLOAD_NAME} className={className}>
      {children}
    </a>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
