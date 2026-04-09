# cssvg-icon — Claude Code Project Guide

This file is auto-loaded by Claude Code. It documents the full project so Claude can assist with any task without re-reading every file.

---

## Project Identity

| Field | Value |
|---|---|
| Package name | `cssvg-icons` |
| Live site | https://icon.cssvg.com |
| Editor | https://cssvg.com |
| GitHub | https://github.com/Harijohnson/cssvg-icon |
| npm | https://www.npmjs.com/package/cssvg-icons |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |

---

## Repository Structure

```
cssvg-icon/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — GA, GTM, fonts, metadata
│   ├── page.tsx                # Home — icon explorer + hero
│   ├── sitemap.ts              # Dynamic XML sitemap (icons + docs + core pages)
│   ├── robots.ts               # robots.txt — allow all, points to sitemap
│   ├── docs/
│   │   ├── page.tsx            # Redirects to /docs/introduction
│   │   └── [slug]/page.tsx     # Dynamic doc page — reads content/docs/<slug>.md
│   ├── icons/[slug]/page.tsx   # Dynamic icon detail page with JSON-LD
│   ├── license/page.tsx
│   ├── privacy/page.tsx
│   └── support/page.tsx
│
├── components/
│   ├── Header.tsx              # Sticky header — logo, Docs link, Editor link, GitHub
│   ├── Footer.tsx              # Footer — Library / Documentation / Resources columns
│   ├── IconExplorer.tsx        # Client — search + controls (color, stroke, size, speed, loop) + grid
│   ├── IconDetailModal.tsx     # Bottom-sheet modal — preview + animation controls + copy/download
│   ├── IconRenderer.tsx        # Dynamic import per slug from icons/<slug>/<slug>.tsx
│   ├── MarkdownPage.tsx        # Renders doc markdown with TOC, prev/next nav
│   ├── DocLayout.tsx           # Sidebar layout for docs
│   └── ...                     # ui/ shadcn components, CopyButton, SearchBar
│
├── icons/                      # Icon registry — one folder per icon
│   └── <slug>/
│       ├── <slug>.tsx          # Animated React component (SMIL)
│       ├── <slug>.json         # Metadata (name, slug, description, tags, credit, link, reference)
│       └── <slug>.svg          # Raw SVG source
│
├── content/
│   └── docs/                   # Markdown documentation files
│       ├── introduction.md
│       ├── getting-started.md
│       ├── usage.md
│       ├── adding-icons.md
│       ├── architecture.md
│       └── design-system.md
│
├── lib/
│   ├── icons-registry.ts       # Server: scans icons/ dir, reads JSON + SVG, returns IconRegistryEntry[]
│   ├── navigation-data.ts      # DOC_NAV array — doc sidebar + prev/next order
│   └── utils.ts                # cn() utility
│
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       ├── publish.yml         # CI + npm publish on PR merge to main
│       └── pr-check.yml        # PR title check + icon file validation + typecheck/lint
│
├── CONTRIBUTING.md             # Full contributor guide — branching, icon spec, PR rules
├── EXPORT_GUIDELINES.md        # TSX component export spec from CSSVG Editor
├── CLAUDE.md                   # ← this file
└── package.json                # name: cssvg-icons, version auto-bumped on merge
```

---

## Key Data Types

### `IconRegistryEntry` (`lib/icons-registry.ts`)
```ts
interface IconRegistryEntry {
  name: string;        // PascalCase — "ArrowRight"
  slug: string;        // kebab-case — "arrow-right"
  description: string;
  tags: string[];
  svgPath: string;     // raw SVG file content (not a file path!)
  link?: string;       // CSSVG share URL
  credit?: string;     // author name
  reference?: string;  // source icon reference URL
}
```

### Icon JSON schema (`icons/<slug>/<slug>.json`)
```json
{
  "name": "Bell",
  "slug": "bell",
  "description": "Animated bell notification icon",
  "tags": ["bell", "notification", "alert"],
  "credit": "Hari",
  "link": "https://icon.cssvg.com/share/...",
  "reference": "https://lucide.dev/icons/bell"
}
```

### Icon TSX component (`icons/<slug>/<slug>.tsx`)
- `"use client"` at top
- `viewBox="0 0 40 40"` — canvas always 40×40
- Props: `className`, `size` (default 40), `color` (default `"currentColor"`), `strokeWidth` (default 2)
- `stroke={color}` — never hardcoded hex
- `strokeWidth={strokeWidth}` — never hardcoded number
- SMIL `<animateTransform>` / `<animate>` kept exactly as exported from CSSVG Editor
- Wrapper: `inline-flex items-center justify-center overflow-hidden` with `width: size, height: size, flexShrink: 0`

---

## Pages & Metadata

| Route | Metadata | Structured Data |
|---|---|---|
| `/` | title, description, keywords, OG, Twitter | none |
| `/docs/[slug]` | title, description, keywords, OG (article), Twitter | BreadcrumbList JSON-LD |
| `/icons/[slug]` | title, description, keywords, OG, Twitter | ImageObject JSON-LD |
| `/sitemap.xml` | auto-generated | — |
| `/robots.txt` | allow all, points to sitemap | — |

Sitemap priorities: `/` = 1.0, `/docs` = 0.9, doc pages = 0.8, icon pages = 0.7, legal = 0.3

Site URL env var: `NEXT_PUBLIC_SITE_URL` (defaults to `https://icon.cssvg.com`)

---

## Analytics & Tracking

- **Google Analytics**: `G-XWWN0WHBDW` — loaded in `app/layout.tsx` via `next/script afterInteractive`
- **Google Tag Manager**: `GTM-K4NJX5K4` — loaded in `app/layout.tsx`
- **Vercel Analytics**: `<Analytics />` from `@vercel/analytics/next`

---

## Icon Explorer Controls (`components/IconExplorer.tsx`)

State managed in `IconExplorer`, passed down to `IconDetailModal`:

| State | Default | Description |
|---|---|---|
| `color` | `"#ffffff"` | Stroke colour — hex input + ChromePicker |
| `strokeWidth` | `2` | Stroke width — range 0.5–4 step 0.5 |
| `size` | `56` | Preview size — range 16–200 step 8 |
| `animPaused` | `false` | Pause/play SMIL animations via `svg.pauseAnimations()` |
| `animSpeed` | `1` | Speed multiplier — presets: 0.25, 0.5, 1, 1.5, 2, 3 |

Animation controls live in the **right column** of `IconDetailModal`, above the action buttons.

---

## Documentation Nav Order (`lib/navigation-data.ts`)

```
/docs/introduction → /docs/getting-started → /docs/usage →
/docs/architecture → /docs/adding-icons → /docs/design-system
```

To add a new doc page:
1. Create `content/docs/<slug>.md`
2. Add entry to `DOC_NAV` in `lib/navigation-data.ts`
3. The sitemap and doc page are auto-generated — no other changes needed

---

## Adding a New Icon

1. Create folder `icons/<slug>/` (lowercase, hyphen-separated)
2. Add `icons/<slug>/<slug>.tsx` — export from CSSVG Editor (40×40, animated, TSX camelCase ON)
3. Add `icons/<slug>/<slug>.json` — fill name, slug, description, tags, credit
4. Icon auto-appears in explorer and sitemap — no registry changes needed

See `CONTRIBUTING.md` for full PR guide and `EXPORT_GUIDELINES.md` for TSX spec.

---

## Commit Message Format

```
<type>(<scope>): <short description>
```

| Type | When |
|---|---|
| `feat` | New icon, page, or feature |
| `fix` | Bug fix |
| `chore` | Config, CI, deps, tooling |
| `docs` | README, markdown content, CONTRIBUTING |
| `refactor` | Cleanup, no behaviour change |
| `style` | Visual/UI tweaks |
| `meta` | Metadata, sitemap, SEO |

Common scopes: `icon`, `docs`, `modal`, `explorer`, `footer`, `header`, `layout`, `sitemap`, `ci`, `deps`, `claude`

Examples:
```
feat(icon): add bell icon
fix(modal): color picker not closing
meta(sitemap): add priority and changeFrequency
docs(claude): add commit slash command
```

Use `/commit` slash command for guided commits.

---

## CI / Publishing

- **On every PR**: `pr-check.yml` runs title prefix check + icon file validation + typecheck + lint
- **On PR merge to main**: `publish.yml` bumps patch version, publishes to npm with provenance
- **PR title format**: `feat: add icon/<slug>` | `fix:` | `chore:` | `docs:` | `refactor:` | `style:` | `test:`

---

## Design System

- Background: `bg-black` (#000000)
- Surface: `bg-zinc-950` / `bg-zinc-900`
- Border: `border-zinc-800` / `border-zinc-900`
- Text primary: `text-white`
- Text muted: `text-zinc-400` / `text-zinc-500`
- Accent: `text-white` buttons on dark backgrounds
- Font: Inter (sans) + Geist Mono (mono)
- No coloured accents — monochrome only

---

## Common Tasks for Claude

### Add a new icon
Use `/add-icon` slash command or follow steps in "Adding a New Icon" above.

### Edit documentation content
Markdown files are in `content/docs/`. Edit directly — pages re-render automatically.
Use `/update-docs` slash command for guided editing.

### Add a new doc page
1. Create `content/docs/<slug>.md`
2. Add to `DOC_NAV` in `lib/navigation-data.ts`

### Update footer links
Edit `components/Footer.tsx` — three column sections: Library, Documentation, Resources.

### Change sitemap priorities
Edit `app/sitemap.ts` — each route type has explicit `changeFrequency` and `priority`.

### Update metadata for a page
- Home: `app/page.tsx` — `export const metadata`
- Docs: `app/docs/[slug]/page.tsx` — `generateMetadata()`
- Icons: `app/icons/[slug]/page.tsx` — `generateMetadata()`
- Global defaults: `app/layout.tsx` — `export const metadata`
