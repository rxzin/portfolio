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

export interface Project {
  id: string;
  title: string;
  kind: string;
  year: string;
  stack: string[];
  summary: string;
  bullets: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const site = {
  name: "Razin Chinwala",
  role: "Full-stack AI engineer",
  /** the subheading under the name in the hero */
  heroRole: "FullStack Engineer",
  company: "Code Colonies",
  location: "Ahmedabad, India",
  timezone: "Asia/Kolkata",
  email: "razin59185@gmail.com",
  description:
    "Full-stack AI engineer building production TypeScript/Python backends and LLM agent systems: multi-tenant SaaS, AI sales automation, RAG, and durable workflows with PostgreSQL, Redis, and Docker.",

  /** one line under the name */
  tagline:
    "I build backends and AI agents that keep working when things go wrong.",

  socials: [
    { label: "GitHub", href: "https://github.com/rxzin" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/razin-c-6943aa145/",
    },
  ] satisfies Link[],

  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ] satisfies Link[],

  // ---- the story -------------------------------------------------------------

  about: [
    "I'm Razin, a full-stack AI engineer in Ahmedabad. I studied computer science with a focus on AI and machine learning, and over the last few years I've moved from training models to **shipping the systems around them**.",
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
      stack: [
        "Next.js",
        "FastAPI",
        "LangGraph",
        "LangChain",
        "Redis",
        "PostgreSQL",
        "Pinecone",
        "Cohere",
        "Hugging Face",
        "Docker",
        "AWS",
      ],
      summary:
        "A production-grade agentic chatbot with a 4-path state machine, hierarchical RAG with verified citations, from-scratch auth, and a human-in-the-loop Jira workflow. Piloted live with 8 users.",
      bullets: [
        "**Hybrid router** (regex fast path + structured classification) across chat, RAG, weather, and bug triage, cutting redundant LLM calls. Streams tokens over SSE with disconnect safety.",
        "Dual **Redis/PostgreSQL memory** with token-budget compaction and rolling sliding-window summarization.",
        "Conversation-scoped **RAG**: hierarchical chunking, local ONNX BGE embeddings on CPU, Pinecone multi-tenant namespaces, and Cohere Rerank v3 for ranked, verified citations.",
        "**Auth from scratch**: OAuth2/JWT, refresh-token rotation, SHA-256 hashed token storage, multi-session device pruning, and admin RBAC.",
        "Human-in-the-loop **chat → Jira** workflow with row-level locks and atomic Redis rate limiting to prevent duplicate tickets. Voice I/O via the Web Speech API.",
        "Multi-stage Docker images built with uv, deployed on **AWS** (EC2, RDS PostgreSQL, S3, CloudFront).",
      ],
    },
    {
      id: "sentiment-analysis",
      title: "Sentiment Analysis of Movie Reviews",
      kind: "NLP research",
      year: "2024",
      stack: ["Python", "PyTorch", "Transformers"],
      summary:
        "Fine-tuned transformer models for binary sentiment classification on the IMDB dataset.",
      bullets: [
        "Fine-tuned **BERT** and **RoBERTa** on IMDB, reaching 93.86% and 94.84% accuracy.",
      ],
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
