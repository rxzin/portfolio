import Art from "@/components/story/Art";

interface CoralProps {
  file: string;
  subject: string;
  /** position, size and rotation classes */
  className?: string;
}

/** A coral photo at the page edge. `mix-blend-screen` drops its black background into the page. */
export default function Coral({ file, subject, className = "" }: CoralProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute mix-blend-screen ${className}`}
    >
      <Art file={file} subject={subject} ratio={1} sizes="36rem" />
    </div>
  );
}
