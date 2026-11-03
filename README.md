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

### Design (branch `variant/newui`)

A cinematic, dark-only longread modeled on the visual language of an editorial "scroll story": the portfolio is
told in numbered chapters (01 About → 06 Stack), each opening with a giant uppercase headline, an 18px caps
statement, then details. Variant 1 (ruled column, dark-mode toggle) is the `variant-1` tag / `main`.

- **Type**: one family, Inter, at three sizes: display (120px at 1440, 40px on a 390 phone, floor 36px so the longest word fits a
  320px phone), 18px uppercase statements, and body. Some headline lines fade toward the bottom (`text-fade`).
- **Color**: near-black, big electric-blue glows, crimson corals and "case file" boxes, `#eee` / `#b4b2b2` text (the muted grey holds 4.5:1 on the blue glow).
- **Renders**: `components/story/Art.tsx` shows each image from `public/newui/`, or a same-size labeled placeholder
  until it exists. Sources, credits and how they are treated: **`docs/newui-assets.md`**.
- **Drawn in code**: a simulated fish school with sharks (`School.tsx`, physics in `lib/school.ts`), glows and
  `+` markers (`Atmosphere.tsx`). All decorative layers are aria-hidden and kept out of text areas.
- **Motion**: slow directional entrances (`Appear`), image parallax (`Parallax`), Lenis smooth scroll, a fixed menu
  button with a full-screen chapter index (`Menu.tsx`). Inline chapter links show from 1280px; narrower uses the menu.
- **Layout rules**: text is never absolutely positioned; renders sit beside/behind headlines on large screens and move
  into the flow on phones; every section clips horizontal overflow. `pnpm audit:responsive` passes at all 10 sizes.

### Design tokens (3 layers)

1. **Primitives**: raw values (`--black-950`, `--electric-600`, `--crimson-900`…), never used directly.
2. **Semantic**: meaning (`--bg`, `--ink`, `--ink-muted`, `--rule`, `--glow`, `--blood`, `--blood-bright`).
3. **Tailwind**: `@theme inline` exposes them as `bg-blood`, `text-ink-muted`, `border-rule`, `text-display`, `text-statement`…

## Structure

```
app/                 layout (Inter, metadata, JSON-LD) · page (chapter order) · globals.css (tokens)
components/
  story/             Chapter (marker → headline → content), Display (giant headline), Art (renders),
                     Coral, Atmosphere (glow, +), School (fish), Menu, ChapterLinks
  story/sections/    Hero, About, Build, Experience, Internships, Projects, Stack, Finale
  motion/            Providers (Lenis + MotionConfig), Appear, Parallax, Magnetic, CountUp
  ui/                BulletList, TechChip, Icon, CopyEmail, ResumeLink (+ dot-matrix vendor files)
  DotMarks.tsx       animated mark beside the name
data/site.ts         ⭐ all content, including `story` (chapter headlines and statements)
docs/newui-assets.md image sources, credits and treatment
lib/                 résumé lookup, tech icons, date helpers, motion tokens, **emphasis** parser
public/newui/        drop generated renders here
scripts/             audit-responsive.mjs
```

## Motion & accessibility

- Lenis smooth scroll; anchor links glide with a nav offset.
- `prefers-reduced-motion`: Lenis is disabled, Motion skips transforms, CSS animations stop, the fish hold still.
- Sections are server components; only interactive pieces ship JS.
- Dark only (`color-scheme: dark`); the menu moves focus to its first link, closes on Escape, and returns focus to its button.
