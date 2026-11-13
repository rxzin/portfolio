// ============================================================
//  ALL SITE CONTENT LIVES HERE, in the order the page tells it.
//  Components only read from this file.
//  Inline `**text**` renders as emphasis (see lib/rich.tsx).
//  Dates are "YYYY-MM". The résumé is whatever PDF is in public/resume/.
// ============================================================

export interface Link {
  label: string;
  href: string;
}

export interface PageLink extends Link {
  /** the page's search description */
  description: string;
}

export interface Stat {
  value: number;
  /** where the count starts, default 0 */
  from?: number;
  /** digits after the decimal point when counting up */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface ProcessStep {
  stage: string;
  /** the skill that drives this stage */
  skill: string;
  /** what the skill forces me to do */
  rule: string;
  /** what comes out of this stage */
  output: string;
}

export interface Role {
  id: string;
  kind: "work" | "internship";
  title: string;
  org: string;
  /** short initials shown in the tile next to the org */
  mark: string;
  location: string;
  start: string;
  /** omit while the role is ongoing */
  end?: string;
  stack: string[];
  summary?: string;
  bullets: string[];
}

export interface ProjectSection {
  label: string;
  bullets: string[];
}

export interface Benchmark {
  /** the setup the numbers were measured on */
  caption: string;
  columns: string[];
  rows: string[][];
  /** how it was measured, shown under the table */
  note: string;
}

export interface Project {
  id: string;
  title: string;
  kind: string;
  year: string;
  stack: string[];
  summary: string;
  /** a flat list; ignored when `sections` is given */
  bullets?: string[];
  /** bullets grouped under headings, all shown */
  sections?: ProjectSection[];
  /** shown after the sections */
  benchmark?: Benchmark;
  href?: string;
  preview?: {
    image: string;
    alt: string;
    video?: string;
  };
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const site = {
  name: "Razin Chinwala",
  /** the name on certificates and other public records; structured data only, never shown */
  alternateName: "Mohmmad Razin Chinwala",
  /** the live domain: canonical URL, sitemap and structured data all come from this */
  url: "https://rxzin.is-a.dev",
  role: "Full-Stack Engineer",
  /** the subheading under the name in the hero */
  heroRole: "Full-Stack Engineer",
  company: "Code Colonies",
  location: "Ahmedabad, India",
  timezone: "Asia/Kolkata",
  email: "razin59185@gmail.com",
  description:
    "Razin Chinwala is a full-stack engineer in Ahmedabad, India, building production TypeScript and Python apps: multi-tenant SaaS, AI agents, and RAG systems.",

  /** one line under the name */
  tagline:
    "I work across frontend, backend, architecture, and infrastructure, with strong expertise in Node.js, TypeScript, Fastapi, React and modern AI tooling.",

  socials: [
    { label: "GitHub", href: "https://github.com/rxzin" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/razin-c-6943aa145/",
    },
  ] satisfies Link[],

  /** the small line above the name in the hero */
  // TODO(razin): placeholder copy, write this in your own voice
  heroGreeting: "Hi, my name is",

  /** the pages after the home page: the nav links, the hero buttons (the first is the main one) and each page's title and search description */
  // TODO(razin): placeholder labels and descriptions, rewrite as you like
  nav: [
    {
      label: "About",
      href: "/about",
      description:
        "Who Razin Chinwala is: background, work experience, internships, tech stack and education.",
    },
    {
      label: "Projects",
      href: "/projects",
      description:
        "Projects Razin Chinwala has built, the services he offers and how he works.",
    },
    {
      label: "Contact",
      href: "/contact",
      description: "How to reach Razin Chinwala: email and résumé.",
    },
  ] satisfies PageLink[],

  // ---- the story -------------------------------------------------------------

  about: [
    "I'm Razin Chinwala, a full-stack engineer in Ahmedabad who builds AI products. I studied computer science with a focus on AI and machine learning, and over the last few years I've moved from training models to **shipping the systems around them**.",
    "My first real ML work was at IBM SkillsBuild, where a disease-diagnosis model I built reached 86% accuracy and our team placed in the **top 6 of 650+** across India. At BISAG-N I worked with satellite imagery, comparing YOLO and U-Net for rooftop detection. U-Net won with an F1 score of 0.89.",
    "Today at Code Colonies I build the backend side of AI products: a multi-tenant WhatsApp automation SaaS, an autonomous sales agent, and the gateway that rate-limits and meters every LLM call. The part I enjoy most is making these systems **correct under failure**, so a crash never sends a message twice or spends the same budget again.",
  ],

  stats: [
    {
      value: 98,
      suffix: " of 113",
      label: "database migrations I designed for WhatsAuto",
    },
    {
      value: 68,
      suffix: "+",
      label:
        "routes moved off legacy Express in under a week, with zero regressions",
    },
    {
      value: 6,
      from: 650,
      prefix: "Top ",
      label: "of 650+ teams at IBM SkillsBuild",
    },
    {
      value: 0.89,
      decimals: 2,
      label: "F1 score on satellite rooftop detection",
    },
  ] satisfies Stat[],

  services: [
    {
      title: "AI agents with a human in the loop",
      description:
        "Agents that read email, qualify leads, book meetings and draft proposals, with approval gates before anything irreversible happens.",
    },
    {
      title: "Retrieval and search",
      description:
        "RAG pipelines with hierarchical chunking and reranked, cited answers, plus image search.",
    },
    {
      title: "Multi-tenant SaaS backends",
      description:
        "Tenant isolation with PostgreSQL row-level security, role-based access, webhook ingestion and idempotent outbound queues.",
    },
    {
      title: "Workflows that survive crashes",
      description:
        "Durable Temporal workflows, two-phase reservations with row locks, and crash-recovery reconciliation.",
    },
  ] satisfies Service[],

  process: [
    {
      stage: "Scope",
      skill: "grilling",
      rule: "Question every decision in the plan until nothing is silently assumed.",
      output: "Shared understanding",
    },
    {
      stage: "Design",
      skill: "system-design",
      rule: "Every decision has trade-offs, so make them explicit.",
      output: "Design with stated trade-offs",
    },
    {
      stage: "Build",
      skill: "test-driven-development",
      rule: "Write the test first and watch it fail.",
      output: "Minimal code that passes",
    },
    {
      stage: "Diagnose",
      skill: "house-style-diagnostics",
      rule: "Treat the first explanation as a hypothesis, then rule out causes with evidence.",
      output: "Root cause, not a patched symptom",
    },
    {
      stage: "Verify",
      skill: "verification-before-completion",
      rule: "No claim that something works without fresh evidence.",
      output: "Proof from a real run",
    },
    {
      stage: "Ship",
      skill: "deploy-checklist",
      rule: "Write down the rollback triggers before deploying.",
      output: "Monitored release",
    },
  ] satisfies ProcessStep[],

  experience: [
    {
      id: "code-colonies",
      kind: "work",
      title: "Associate Fullstack AI Consultant",
      org: "Code Colonies",
      mark: "CC",
      location: "Ahmedabad",
      start: "2026-04",
      stack: [
        "TypeScript",
        "NestJS",
        "Fastify",
        "Prisma",
        "PostgreSQL",
        "Temporal.io",
        "Redis",
        "React",
        "Docker",
      ],
      summary:
        "Leading AI-heavy backend work: a WhatsApp automation SaaS, autonomous sales agents, and the infrastructure that keeps LLM workflows safe and metered.",
      bullets: [
        "Led development of **WhatsAuto**, a multi-tenant WhatsApp automation SaaS: chose the stack, designed the database schema (98 of 113 migrations), and deployed it on a Contabo VPS.",
        "Built tenant-isolated RBAC with **PostgreSQL row-level security**, plus a Meta WhatsApp Cloud API integration with webhook ingestion, an idempotent outbound queue, and template sync.",
        "Built an **AI auto-reply agent** that answers from each tenant's knowledge base with human takeover, plus a visual flow builder for message automation and campaign scheduling.",
        "Migrated an internal sales CRM from legacy Express.js (68+ routes) to **Fastify, Prisma, and PostgreSQL** with JWT RBAC in under a week, with zero regressions.",
        "Built an **autonomous AI sales agent** that reads and replies to email, qualifies leads, books meetings, and drafts proposals, with human approval gates.",
        "Designed a **multi-LLM gateway** with distributed rate limiting, priority lanes, and token metering, used by Temporal lead-discovery and campaign workflows.",
        "Built a distributed **multi-agent scheduling engine** for a community platform in 1 day for a stakeholder demo, with probabilistic, activity-aware scheduling.",
        "Implemented **two-phase action reservations** with row locks and crash-recovery reconciliation to prevent duplicate AI actions and budget leaks.",
        "Built **search-by-image** for an e-commerce platform using AWS Bedrock embeddings, a pgvector HNSW index, and an SSRF-hardened image proxy.",
        'Built an event-driven **"frequently bought together"** engine (Jaccard similarity to reduce popularity bias), plus order, shipping, and tracking notifications through WhatsAuto.',
      ],
    },
  ] satisfies Role[],

  internships: [
    {
      id: "bisag-n",
      kind: "internship",
      title: "Research Intern: Computer Vision",
      org: "BISAG-N",
      mark: "BN",
      location: "Gandhinagar",
      start: "2025-02",
      end: "2025-05",
      stack: [
        "PyTorch",
        "QGIS",
        "NumPy",
        "Rasterio",
        "Scikit-Learn",
        "Matplotlib",
      ],
      bullets: [
        "Designed a **rooftop detection pipeline** on satellite imagery comparing YOLOv11 (S/M), YOLOv8 (S/L), and U-Net (ResNet-152). U-Net reached the best F1 of **0.89** vs 0.73–0.76 for YOLO.",
        "Improved feature extraction with classical and deep-learning filters, and regularized predictions with minimum bounding rectangles from model and HED edge outputs, refined by geospatial queries.",
      ],
    },
    {
      id: "ibm-skillsbuild",
      kind: "internship",
      title: "AI Intern",
      org: "IBM SkillsBuild",
      mark: "IBM",
      location: "Remote",
      start: "2024-06",
      end: "2024-07",
      stack: ["IBM watsonx AI", "IBM Cloud", "AutoAI", "Data Preprocessing"],
      bullets: [
        "Developed a **disease diagnosis model** with IBM AutoAI on 257K+ rows, 371 features, and 757 diseases, reaching **86% accuracy**.",
        "Integrated IBM watsonx Assistant for conversational specialist recommendations, and placed in the **winning top 6 of 650+ teams** across India.",
      ],
    },
  ] satisfies Role[],

  projects: [
    {
      id: "agentic-rag-chatbot",
      title: "Agentic AI Chatbot with RAG",
      kind: "Full-stack web app",
      year: "2026",
      href: "https://razin.tech",
      preview: {
        image: "/projects/chatbot-preview.jpg",
        video: "/projects/chatbot-preview.mp4",
        alt: "Live chatbot preview interface at razin.tech",
      },
      stack: [
        "Next.js",
        "FastAPI",
        "LangGraph",
        "Langfuse",
        "Mistral",
        "Neon",
        "Redis",
        "PostgreSQL",
        "Pinecone",
        "Cohere",
        "Exa",
        "Docker",
      ],
      summary:
        "A production-grade agentic chatbot that decides per message whether to answer directly or search the user's documents, the web, live weather, or file a bug report, then streams back an answer with inline citations. Piloted live with 8 users, covered by 251 tests, and load-tested with k6.",
      sections: [
        {
          label: "Agent & retrieval",
          bullets: [
            "**LangGraph tool-calling agent** on Mistral (ministral-14b, falling back to 8b on errors) with up to 4 tool rounds per message, 20s per-tool timeouts with error recovery, live status steps, and three suggested follow-up questions. Replies stream as typed SSE events.",
            "Conversation-scoped **RAG**: background indexing of PDF and text uploads with mistral-embed into Pinecone, Cohere reranking, and **Exa web search**, all cited inline as numbered badges that preview the passage or page on hover.",
          ],
        },
        {
          label: "Memory & operations",
          bullets: [
            "Dual **Redis Cloud/Neon PostgreSQL memory**: a 24-hour Redis working set rebuilt from Postgres when cold, a token budget estimated with tiktoken, and old turns folded into a rolling summary.",
            "Distributed tracing using Langfuse (turn sessions, model generations, token counts, tool observations), daily quotas of 200 messages and 30 web searches per user, web results treated as untrusted input, and a single FastAPI app serving the Next.js static build, deployed to **FastAPI Cloud** by GitHub Actions.",
          ],
        },
        {
          label: "Security & admin",
          bullets: [
            "**Auth from scratch**: Argon2id password hashing, short-lived in-memory access tokens, rotating refresh tokens in HTTP-only cookies, instant revocation, permission-based admin roles, and rate-limited login and sign-up.",
            "Human-in-the-loop **chat → Jira** workflow: the model drafts bug reports from the conversation, an admin approves them, and the user gets an email. A failed approval rolls back so it can be retried.",
            "**Admin dashboard** with tabs gated by fine-grained permissions: live cards for pending bugs, users, bans, active sessions, 24-hour requests and server errors; 90-day request audit log, filterable by user, path, method and status, with cursor pagination; user search with per-device sessions you can revoke one at a time or all at once, plus confirmed ban and unban; and a dedicated **Usage tab** showing token volume, prompt/completion breakdown, top consumers, and purpose tags.",
          ],
        },
        {
          label: "Reliability & testing",
          bullets: [
            "**251 tests at 83% coverage**, run against real PostgreSQL and Redis containers with a scripted fake model, so no test calls a paid API.",
            "Concurrency tests found and fixed a **database-pool deadlock at 16+ simultaneous streams**, replies lost when the client disconnected at the last moment, and duplicate model runs on retry, now prevented with **idempotency keys**.",
          ],
        },
      ],
      benchmark: {
        caption: "Single API instance (1 vCPU) · single PostgreSQL node",
        columns: ["Workload", "Peak req/min", "p95 at 50% load"],
        rows: [
          ["Chat turns (streamed)", "749", "940 ms"],
          ["Reads", "5,311", "626 ms"],
          ["Writes", "4,255", "116 ms"],
          ["Logins (Argon2id)", "2,001", "69 ms"],
        ],
        note: "Load-tested with k6 on one machine, with the model faked; no errors at any level. The API process's CPU is the bottleneck, so the next step is several instances behind a load balancer.",
      },
    },
  ] satisfies Project[],

  skills: [
    {
      label: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"],
    },
    {
      label: "Backend and frontend",
      items: [
        "Node.js",
        "NestJS",
        "Fastify",
        "FastAPI",
        "Express.js",
        "Prisma",
        "TypeORM",
        "Temporal.io",
        "BullMQ",
        "React",
        "Next.js",
      ],
    },
    {
      label: "AI and LLM",
      items: [
        "LangChain",
        "LangGraph",
        "Langfuse",
        "RAG",
        "AI Agents",
        "OpenAI",
        "Gemini",
        "Mistral",
        "AWS Bedrock",
        "pgvector",
        "Pinecone",
        "Hugging Face",
        "PyTorch",
      ],
    },
    {
      label: "Data and DevOps",
      items: [
        "PostgreSQL",
        "Redis",
        "Docker",
        "AWS",
        "Railway",
        "Vercel",
        "Git",
      ],
    },
  ] satisfies SkillGroup[],

  education: [
    {
      school: "Adani Institute of Infrastructure Engineering",
      mark: "AIIE",
      degree: "B.E. Computer Science & Engineering (AI & ML)",
      period: "2021–2025",
      score: "CGPA 8.94 / 10",
    },
    {
      school: "Infocity Junior Science College",
      mark: "IJSC",
      degree: "Higher Secondary (XII)",
      period: "2019–2021",
      score: "86%",
    },
  ],

  certifications: [
    "Introduction to Node.js, v3",
    "TypeScript: From First Steps to Professional",
    "Professional CSS: Build a Website from Scratch",
  ],

  contact: {
    heading: "Building something with LLMs that has to work in production?",
    body: "I'm happy to talk through agents, retrieval, or the backend that holds them together. Email is the fastest way to reach me.",
  },
};
