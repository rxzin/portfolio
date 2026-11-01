import {
  type SimpleIcon,
  siContabo,
  siCss,
  siDocker,
  siExpress,
  siFastapi,
  siFastify,
  siGit,
  siGooglegemini,
  siHtml5,
  siHuggingface,
  siJavascript,
  siLangchain,
  siLanggraph,
  siMistralai,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPostgresql,
  siPrisma,
  siPython,
  siPytorch,
  siQgis,
  siRailway,
  siReact,
  siRedis,
  siScikitlearn,
  siTemporal,
  siTypeorm,
  siTypescript,
  siVercel,siRedbull,
} from "simple-icons";
import { awsIcon } from "./aws-icon";

// Brand icons from Simple Icons (CC0). Names without an official icon simply render as text.
const byName: Record<string, Pick<SimpleIcon, "hex" | "path">> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  HTML: siHtml5,
  CSS: siCss,
  "Node.js": siNodedotjs,
  NestJS: siNestjs,
  Fastify: siFastify,
  FastAPI: siFastapi,
  "Express.js": siExpress,
  Prisma: siPrisma,
  TypeORM: siTypeorm,
  "Temporal.io": siTemporal,
  React: siReact,
  "Next.js": siNextdotjs,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  Gemini: siGooglegemini,
  Mistral: siMistralai,
  "Hugging Face": siHuggingface,
  Transformers: siHuggingface,
  PyTorch: siPytorch,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Docker: siDocker,
  Railway: siRailway,
  Vercel: siVercel,
  Git: siGit,
  QGIS: siQgis,
  NumPy: siNumpy,
  "Scikit-Learn": siScikitlearn,
  Contabo: siContabo,
  AWS: awsIcon,
  "AWS Bedrock": awsIcon,
  pgvector: siPostgresql,
  BullMQ: siRedbull,
};

/** Relative luminance of a hex color, 0 (black) to 1 (white). */
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface TechIcon {
  path: string;
  /** brand color, or "currentColor" for near-black brands so they stay visible in dark mode */
  color: string;
}

export function techIcon(name: string): TechIcon | null {
  const icon = byName[name];
  if (!icon) return null;
  return {
    path: icon.path,
    color: luminance(icon.hex) < 0.04 ? "currentColor" : `#${icon.hex}`,
  };
}
