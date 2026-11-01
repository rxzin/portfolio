# Razin Chinwala — Portfolio

Personal portfolio of a Full-Stack AI Engineer. Built with **Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Lenis**.

## Run

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm build       # production build (page is fully static)
pnpm lint        # Biome: lint + format check + import order
pnpm format      # Biome: format files in place
```

Linting/formatting is [Biome](https://biomejs.dev) (`biome.json`), not ESLint.
`pnpm exec biome check --write` applies all safe fixes.

### Responsive audit

With the site running (`pnpm dev` or `pnpm start`), in a second terminal:

```bash
pnpm audit:responsive                          # audits http://localhost:3000
pnpm audit:responsive http://localhost:3123    # or any URL
```

It opens headless Chrome at 10 sizes (320px phone → 2560px monitor, plus phone landscape and tablets)
and fails (exit 1) on horizontal scrolling, elements past the screen edge, text overflowing its box,
text under 12px, or tap targets under 24×24px (WCAG 2.2 AA). Screenshots land in `.audit/` (git-ignored).
Set `CHROME_PATH` if Chrome isn't in a standard location.

Deploys to Vercel as-is.

## Where things live

| Want to change…            | Edit                                              |
| -------------------------- | ------------------------------------------------- |
| Any text, role, project    | `data/site.ts` (typed; `**x**` = bold)           |
| Colors, fonts, type scale  | `app/globals.css` (design tokens)                 |
| Animation easing/durations | `lib/motion.ts` (+ matching CSS vars)             |
| Résumé                     | drop any PDF into `public/resume/` (see below)    |

### Résumé

Every résumé link points at whatever PDF is in `public/resume/`, so swapping it needs no code change:
replace the file (any name) and rebuild/redeploy. With several PDFs there, the most recently modified wins.
Downloads are always saved as `Razin_Chinwala_Resume.pdf`. If the folder is empty, the résumé links are hidden.
(Logic: `lib/resume.ts`.)

### Design

The page reads like a ruled sheet: one centered column with side rules, sections separated by rules that run
the full screen width (`rule-t` / `rule-b` utilities in `globals.css`). It tells a story top to bottom:
who I am → my path → numbers → what I build → experience → internships → projects → stack → education → contact.
Type: **Instrument Sans** for reading, **JetBrains Mono** for dates, durations and data.

- **Cover** (`components/Cover.tsx`): canvas dot grid at the top that lights up around the pointer, ripples on
  click/tap, and drifts on its own when idle. Pauses off-screen; static with reduced motion.
- **Blueprint texture**: hatched gaps between sections (`bg-hatch`) and + marks where rules cross (`cross`).
- **Logos**: brand icons from [Simple Icons](https://simpleicons.org) (CC0) in tech chips, mapped in
  `lib/tech-icons.ts` (names without an icon render as text). Company/school tiles use the `mark` field in `data/site.ts`.
- **Dot-matrix marks** (`components/DotMarks.tsx`): animated loaders from [dotmatrix](https://dotmatrix.zzzzshawn.cloud)
  beside the name: `dotm-3x3-11` in the nav, `dotm-square-12` in the intro. All their settings live in that one file.
  Installed with the shadcn CLI (`components.json` registers `@dotmatrix`); the vendor files
  (`components/ui/dotm-*`, `lib/dotmatrix-*`, `components/dotmatrix-loader.css`) are excluded from Biome so
  `pnpm dlx shadcn@latest add @dotmatrix/<name> --overwrite` can update them cleanly.
  Their color comes from `--color-dot-on` in `globals.css` (mapped to `--ink`, so it follows the theme).
- **Dark mode**: toggle in the nav with a circular reveal (View Transitions API). Defaults to the system setting,
  remembers the choice, and an inline script in `layout.tsx` applies it before paint so there is no flash.

### Design tokens (3 layers)

1. **Primitives**: raw values (`--fog-*`, `--slate-*`, `--cobalt-600`), never used directly.
2. **Semantic**: meaning (`--bg`, `--panel`, `--rule`, `--ink-muted`, `--accent`). Dark mode overrides only
   this layer (`:root.dark`), so components never check the theme.
3. **Tailwind**: `@theme inline` exposes them as `bg-panel`, `text-ink-muted`, `border-rule`, `text-accent`, `text-h2`…

## Structure

```
app/             layout (fonts, metadata, JSON-LD) · page (section order) · globals.css (tokens)
components/
  sections/      Intro, About, Numbers, Services, Experience (also used for Internships),
                 Projects, Stack, Education, Contact
  RoleEntry.tsx  one job/internship: org, title, dates, bullets, stack
  Cover.tsx      interactive dot-grid banner
  ThemeToggle.tsx light/dark switch
  Nav.tsx        hide-on-scroll nav with active-section underline
  motion/        Providers (Lenis + MotionConfig), Reveal, Magnetic, CountUp, SpotlightCard
  ui/            Section (+ hatched Gap), BulletList, Tags, TechChip, Mark, Icon, LocalTime, CopyEmail, ResumeLink
data/site.ts     ⭐ all content, in story order
lib/             résumé lookup, tech icons, date helpers, motion tokens, **emphasis** parser
scripts/         audit-responsive.mjs
_legacy/         old static template (git-ignored; delete when ready)
```

## Motion & accessibility

- Lenis smooth scroll; anchor links glide with a nav offset.
- `prefers-reduced-motion`: Lenis is disabled, Motion skips transforms, CSS animations stop.
- Sections are server components; only interactive pieces ship JS.
