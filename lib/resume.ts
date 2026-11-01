import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "public", "resume");

/**
 * Finds the résumé to link to: any PDF in public/resume/ (newest wins if there are several).
 * Swap the file and rebuild; no code change needed. Server-only (reads the filesystem at build).
 */
export function getResumeHref(): string | null {
  let pdfs: string[];
  try {
    pdfs = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  } catch {
    pdfs = [];
  }
  if (pdfs.length === 0) {
    console.warn(
      "[resume] No PDF found in public/resume/; résumé links are hidden.",
    );
    return null;
  }
  const newest = pdfs
    .map((f) => ({ f, t: statSync(join(DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].f;
  return `/resume/${encodeURIComponent(newest)}`;
}

/** Name the file is saved as when downloaded, whatever it is called on disk. */
export const RESUME_DOWNLOAD_NAME = "Razin_Chinwala_Resume.pdf";
