import Appear from "@/components/motion/Appear";

interface DisplayProps {
  /** lines; "|" splits a line into left and right halves pushed apart */
  lines: string[];
  /** indices of lines that fade toward the bottom */
  fade?: number[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}

/**
 * The giant uppercase headline. Real text (not images), so it stays readable and indexable.
 * Each line slides in from alternating sides. Words wrap rather than overflow: the display size's
 * floor is set so the longest single word used still fits a 320px screen.
 */
export default function Display({
  lines,
  fade = [],
  as: Tag = "h2",
  id,
  className = "",
}: DisplayProps) {
  return (
    <Tag
      id={id}
      className={`text-display font-bold uppercase tracking-[-0.055em] [overflow-wrap:normal] ${className}`}
    >
      {lines.map((line, i) => {
        const [left, right] = line.split("|");
        const fadeClass = fade.includes(i) ? "text-fade" : "";
        return (
          <Appear
            key={line}
            as="span"
            from={i % 2 === 0 ? "left" : "right"}
            delay={0.1 + i * 0.12}
            className={`block ${right ? "flex flex-wrap justify-between gap-x-[0.3em]" : ""}`}
          >
            <span className={`${fadeClass} pb-[0.04em]`}>{left}</span>
            {right && (
              <>
                {" "}
                <span className={`${fadeClass} pb-[0.04em]`}>{right}</span>
              </>
            )}
          </Appear>
        );
      })}
    </Tag>
  );
}
