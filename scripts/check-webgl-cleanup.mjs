// Fails if a component calls loseContext(), which React Bits components (Beams, Ferrofluid) do in
// their effect cleanup. Strict Mode re-runs effects on the same canvas in dev, and getContext then
// returns the context that was just killed, so the animation stays blank. Runs with `pnpm dev` and
// `pnpm lint`, because `shadcn add --overwrite` or a new background brings the call back.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const offenders = readdirSync("components", { recursive: true })
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => join("components", file))
  .flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) =>
        /\.loseContext\s*\(/.test(line) ? [`  ${file}:${i + 1}`] : [],
      ),
  );

if (offenders.length) {
  console.error(
    `loseContext() leaves WebGL canvases blank under Strict Mode. Delete the line:\n${offenders.join("\n")}`,
  );
  process.exit(1);
}
