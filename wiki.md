# cssvg-icon Wiki

> Animated SVG icon library for React and Next.js.
> **[icon.cssvg.com](https://icon.cssvg.com)** · [npm](https://www.npmjs.com/package/cssvg-icons) · [GitHub](https://github.com/Harijohnson/cssvg-icon)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [Usage](#3-usage)
4. [Props API](#4-props-api)
5. [Available Icons](#5-available-icons)
6. [Project Structure](#6-project-structure)
7. [Architecture](#7-architecture)
8. [Design System](#8-design-system)
9. [Icon Component Spec](#9-icon-component-spec)
10. [JSON Metadata Schema](#10-json-metadata-schema)
11. [Adding a New Icon](#11-adding-a-new-icon)
12. [CI / Automated Checks](#12-ci--automated-checks)
13. [Publishing to npm](#13-publishing-to-npm)
14. [Local Development](#14-local-development)
15. [Contributing](#15-contributing)
16. [Commit Message Format](#16-commit-message-format)
17. [PR Rules](#17-pr-rules)
18. [License](#18-license)

---

## 1. Overview

`cssvg-icons` is an open-source animated SVG icon library. Icons are built as self-contained React components using SMIL animations, exported from the [CSSVG Editor](https://cssvg.com). The package is tree-shakeable — only the icons you import are included in your bundle.

**Key facts:**

| Field | Value |
|---|---|
| npm package | `cssvg-icons` |
| Live site | https://icon.cssvg.com |
| Editor | https://cssvg.com |
| GitHub | https://github.com/Harijohnson/cssvg-icon |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| License | MIT |

---

## 2. Installation

```bash
# npm
npm install cssvg-icons

# bun
bun add cssvg-icons

# pnpm
pnpm add cssvg-icons
```

---

## 3. Usage

### Named import (recommended — tree-shakeable)

```tsx
import { Heart, Settings, ArrowRight } from "cssvg-icons";

export default function App() {
  return (
    <Heart color="#ffffff" strokeWidth={2} size={40} />
  );
}
```

### Direct import

```tsx
import HeartIcon from "cssvg-icons/icons/heart/heart";

export default function App() {
  return (
    <HeartIcon color="#ffffff" strokeWidth={2} size={40} />
  );
}
```

### With Tailwind color (currentColor)

```tsx
import { Trash } from "cssvg-icons";

// Icon inherits text color from parent
<span className="text-red-500">
  <Trash size={24} />
</span>
```

### Custom stroke width

```tsx
import { Settings } from "cssvg-icons";

<Settings color="#a1a1aa" strokeWidth={1.5} size={32} />
```

---

## 4. Props API

All icons share an identical props interface:

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"currentColor"` | Stroke color — any valid CSS color or hex |
| `strokeWidth` | `number` | `2` | Stroke width in px. Range: 0.5–4, step 0.5 |
| `size` | `number` | `40` | Width and height in px |
| `className` | `string` | `""` | Additional CSS class names |

---

## 5. Available Icons

| Export Name | Slug | Import |
|---|---|---|
| `ArrowRight` | `arrow-right` | `import { ArrowRight } from "cssvg-icons"` |
| `BellRing` | `bell-ring` | `import { BellRing } from "cssvg-icons"` |
| `Download` | `download` | `import { Download } from "cssvg-icons"` |
| `Heart` | `heart` | `import { Heart } from "cssvg-icons"` |
| `Minus` | `minus` | `import { Minus } from "cssvg-icons"` |
| `Pause` | `pause` | `import { Pause } from "cssvg-icons"` |
| `Play` | `play` | `import { Play } from "cssvg-icons"` |
| `Plus` | `plus` | `import { Plus } from "cssvg-icons"` |
| `Refresh` | `refresh` | `import { Refresh } from "cssvg-icons"` |
| `Search` | `search` | `import { Search } from "cssvg-icons"` |
| `Settings` | `settings` | `import { Settings } from "cssvg-icons"` |
| `Share` | `share` | `import { Share } from "cssvg-icons"` |
| `StarGrow` | `star-grow` | `import { StarGrow } from "cssvg-icons"` |
| `StarSpin` | `star-spin` | `import { StarSpin } from "cssvg-icons"` |
| `Trash` | `trash` | `import { Trash } from "cssvg-icons"` |
| `Upload` | `upload` | `import { Upload } from "cssvg-icons"` |

Browse and preview all icons at [icon.cssvg.com](https://icon.cssvg.com).

---

## 6. Project Structure

```
cssvg-icon/
├── app/                        # Next.js App Router — icon explorer website
│   ├── layout.tsx              # Root layout — GA, GTM, fonts, metadata
│   ├── page.tsx                # Home — icon explorer + hero
│   ├── sitemap.ts              # Dynamic XML sitemap
│   ├── robots.ts               # robots.txt
│   ├── docs/[slug]/page.tsx    # Dynamic doc pages
│   ├── icons/[slug]/page.tsx   # Dynamic icon detail pages
│   ├── license/page.tsx
│   ├── privacy/page.tsx
│   └── support/page.tsx
│
├── components/
│   ├── Header.tsx              # Sticky header
│   ├── Footer.tsx              # Footer with nav columns
│   ├── IconExplorer.tsx        # Search + controls + icon grid
│   ├── IconDetailModal.tsx     # Bottom-sheet — preview + copy + download
│   ├── IconRenderer.tsx        # Dynamic import per slug
│   └── MarkdownPage.tsx        # Doc page renderer
│
├── icons/                      # Icon registry — one folder per icon
│   └── <slug>/
│       ├── <slug>.tsx          # Animated React component (SMIL)
│       ├── <slug>.json         # Metadata
│       └── <slug>.svg          # Raw SVG source
│
├── content/
│   └── docs/                   # Markdown documentation
│
├── lib/
│   ├── icons-registry.ts       # Server: scans icons/, returns registry
│   ├── navigation-data.ts      # Doc sidebar nav order
│   └── utils.ts                # cn() utility
│
├── scripts/
│   └── generate-index.mjs      # Auto-generates index.ts from icons/
│
├── index.ts                    # npm entry — all named exports
├── .github/workflows/
│   ├── publish.yml             # CI + npm publish on PR merge
│   └── pr-check.yml            # PR validation + icon checks
├── CONTRIBUTING.md
├── EXPORT_GUIDELINES.md
└── package.json
```

**What ships in the npm package** (controlled by `"files"` in `package.json`):

```
index.ts
icons/**/*.tsx
icons/**/*.json
icons/**/*.svg
```

Everything else (Next.js app, components, content, scripts, config) is excluded from the published package.

---

## 7. Architecture

### Shadow Registry

Each icon is self-contained in its own folder under `icons/`. There is no central registry file to edit — adding a folder automatically makes the icon available everywhere:

- The icon explorer website (`lib/icons-registry.ts`) scans the directory at build time
- The npm package exports every icon via `index.ts` (auto-generated by `scripts/generate-index.mjs`)
- The sitemap and icon detail pages are auto-generated from the same scan

### Icon Explorer Controls

State managed in `IconExplorer`, passed to `IconDetailModal`:

| State | Default | Description |
|---|---|---|
| `color` | `#ffffff` | Stroke color — hex input + color picker |
| `strokeWidth` | `2` | Stroke width — range 0.5–4 step 0.5 |
| `size` | `56` | Preview size — range 16–200 step 8 |
| `animPaused` | `false` | Pause/play SMIL via `svg.pauseAnimations()` |
| `animSpeed` | `1` | Speed multiplier — presets: 0.25, 0.5, 1, 1.5, 2, 3 |

### `index.ts` Generation

`scripts/generate-index.mjs` reads `icons/` and writes `index.ts` automatically. Run it locally after adding a new icon:

```bash
node scripts/generate-index.mjs
```

CI runs this automatically before every publish so the npm package always reflects all icons.

---

## 8. Design System

The site follows a strict **Monochrome Minimalist** system. No color accents — everything is black, white, or zinc.

| Token | Tailwind class | Hex |
|---|---|---|
| Background | `bg-black` | `#000000` |
| Surface | `bg-zinc-950` / `bg-zinc-900` | — |
| Border | `border-zinc-800` / `border-zinc-900` | — |
| Text primary | `text-white` | `#FFFFFF` |
| Text muted | `text-zinc-400` / `text-zinc-500` | `#a1a1aa` / `#71717a` |

**Typography:** Inter (sans) + Geist Mono (mono)

**Rules:**
- Never use colored accents (no blue, red, green, etc.)
- No `bg-white` or background colors on icon wrappers
- Buttons: white text on dark backgrounds

---

## 9. Icon Component Spec

Every icon component must follow this exact structure. This spec is enforced by CI.

### Full template

```tsx
"use client";

// Auto-generated by CSSVG Editor
// Drop into any Next.js / Vite + Tailwind v3+ project.

export interface IconNameProps {
  className?: string;
  size?: number;       // default: 40
  color?: string;      // default: "currentColor"
  strokeWidth?: number; // default: 2
}

export default function IconName({
  className = "",
  size = 40,
  color = "currentColor",
  strokeWidth = 2,
}: IconNameProps = {}) {
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
      >
        {/* SMIL animation + paths here — untouched from editor */}
        <path
          d="..."
          stroke={color}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
```

### Rules (enforced by CI)

| Rule | ✅ Correct | ❌ Wrong |
|---|---|---|
| File directive | `"use client"` at top | Missing |
| Canvas | `viewBox="0 0 40 40"` | Any other viewBox |
| SVG dimensions | `width={size} height={size}` | `width="40"` hardcoded |
| Stroke color | `stroke={color}` | `stroke="#bcbcbc"` |
| Stroke width | `strokeWidth={strokeWidth}` | `strokeWidth={2}` |
| Stroke scaling | `vectorEffect="non-scaling-stroke"` on all stroked shapes | Missing |
| Animation duration | `dur="4s"` on all animate elements | Any other duration |
| Animations | Keep SMIL exactly as exported | Convert to CSS keyframes |
| Background | No `bg-white` or fill on wrapper | `bg-white` on div |
| Export | `export default function` | No default export |

---

## 10. JSON Metadata Schema

Each icon folder must contain a `<slug>.json` file:

```json
{
  "name": "Bell",
  "slug": "bell",
  "description": "Animated bell notification icon",
  "tags": ["bell", "notification", "alert", "ring"],
  "credit": "Your Name",
  "link": "https://icon.cssvg.com/share/YOUR_SHARE_ID",
  "reference": "https://lucide.dev/icons/bell"
}
```

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | PascalCase readable name — `"Bell"`, `"ArrowRight"` |
| `slug` | ✅ | Lowercase hyphen-separated — must match folder and file name |
| `description` | ✅ | One sentence describing the icon |
| `tags` | ✅ | Array of lowercase search keywords (min 1) |
| `credit` | optional | Your name or handle |
| `link` | ✅ | CSSVG share URL for the animation |
| `reference` | optional | Source icon reference URL |

---

## 11. Adding a New Icon

### Step 1 — Create a branch

```bash
git checkout -b icon/<slug>
# e.g.
git checkout -b icon/bell
```

### Step 2 — Create the icon folder

```
icons/
  bell/
    bell.tsx    ← animated React component
    bell.json   ← metadata
    bell.svg    ← raw SVG source
```

All three files must share the **exact same name** as the folder (the slug).

### Step 3 — Export from CSSVG Editor

Go to [cssvg.com](https://cssvg.com) and design your animated icon.

**Export settings:**

| Setting | Value |
|---|---|
| Canvas size | **40 × 40** |
| Export format | **Animated** (not static) |
| SVG camelCase toggle | **OFF** — for `.svg` export |
| TSX camelCase toggle | **ON** — for `.tsx` export |

Paste the `.tsx` output into `icons/<slug>/<slug>.tsx`.

### Step 4 — Regenerate index.ts

```bash
node scripts/generate-index.mjs
```

This updates `index.ts` with your new icon. CI also runs this automatically before publishing.

### Step 5 — Commit and open a PR

```bash
git add icons/bell/
git add index.ts
git commit -m "feat: add icon/bell"
git push origin icon/bell
```

Open a PR against `main`. CI will validate the icon files automatically.

---

## 12. CI / Automated Checks

Two workflows run on every PR to `main`:

### `pr-check.yml` — runs on every PR

**1. PR title check** — title must start with one of:

```
feat:   fix:   chore:   docs:   refactor:   style:   test:
```

**2. Icon file validation** — runs when `icons/` files are changed. Checks:

- Slug is lowercase and hyphen-separated
- `<slug>.tsx` and `<slug>.json` both exist
- `"use client"` is present
- `viewBox="0 0 40 40"` is present
- No hardcoded `width="40"` / `height="40"` (must use `{size}`)
- No hardcoded hex stroke colors (must use `{color}`)
- No hardcoded `strokeWidth` numbers (must use `{strokeWidth}`)
- All stroked shapes have `vectorEffect="non-scaling-stroke"`
- All animation durations are `4s`
- `export default function` is present
- JSON has all required fields: `name`, `slug`, `description`, `tags`, `link`
- `tags` is an array with at least one entry
- JSON `slug` matches the folder name

**3. Type-check & lint** — always runs:

```bash
npm run typecheck
npm run lint
```

### `publish.yml` — runs when a PR is merged to main

1. Runs CI checks (typecheck, lint, build)
2. Regenerates `index.ts` from `icons/`
3. Bumps patch version (`npm version patch`)
4. Commits version bump back to `main`
5. Publishes to npm with provenance (`npm publish --provenance --access public`)

**Required GitHub secret:** `NPM_TOKEN` — set in repo Settings → Secrets and variables → Actions.

---

## 13. Publishing to npm

Publishing is fully automated. When a PR is merged to `main`:

1. The patch version is bumped automatically (e.g. `1.0.3` → `1.0.4`)
2. `index.ts` is regenerated to include any new icons
3. The package is published to npm with provenance

**What gets published** (12 kB packed):

```
index.ts
icons/**/*.tsx
icons/**/*.json
icons/**/*.svg
package.json
LICENSE
README.md
```

The entire Next.js website, config files, and docs are excluded via the `"files"` field in `package.json`.

To publish manually via a version tag (skip the auto-bump):

```bash
git tag v1.2.0
git push origin v1.2.0
```

---

## 14. Local Development

### Setup

```bash
git clone https://github.com/Harijohnson/cssvg-icon.git
cd cssvg-icon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format all TS/TSX files |
| `node scripts/generate-index.mjs` | Regenerate `index.ts` from `icons/` |

### Adding a doc page

1. Create `content/docs/<slug>.md`
2. Add an entry to `DOC_NAV` in `lib/navigation-data.ts`
3. The page, sitemap entry, and sidebar nav are auto-generated — no other changes needed

### Sitemap priorities

| Route | Priority | Change frequency |
|---|---|---|
| `/` | 1.0 | daily |
| `/docs` | 0.9 | weekly |
| `/docs/[slug]` | 0.8 | weekly |
| `/icons/[slug]` | 0.7 | monthly |
| Legal pages | 0.3 | yearly |

---

## 15. Contributing

Contributions are welcome: new icons, bug fixes, docs improvements.

- [CONTRIBUTING.md](CONTRIBUTING.md) — full guide
- [EXPORT_GUIDELINES.md](EXPORT_GUIDELINES.md) — TSX component spec
- [Open an issue](https://github.com/Harijohnson/cssvg-icon/issues)
- [Browse the icon explorer](https://icon.cssvg.com)

Quick start for a new icon:

```bash
git checkout -b icon/<slug>
# add icons/<slug>/<slug>.tsx, .json, .svg
node scripts/generate-index.mjs
git add icons/<slug>/ index.ts
git commit -m "feat: add icon/<slug>"
git push origin icon/<slug>
# open PR against main
```

---

## 16. Commit Message Format

```
<type>(<scope>): <short description>
```

**Types:**

| Type | When |
|---|---|
| `feat` | New icon, page, or feature |
| `fix` | Bug fix |
| `chore` | Config, CI, deps, tooling |
| `docs` | README, markdown, CONTRIBUTING |
| `refactor` | Cleanup, no behaviour change |
| `style` | Visual/UI tweaks |
| `meta` | Metadata, sitemap, SEO |

**Common scopes:** `icon`, `docs`, `modal`, `explorer`, `footer`, `header`, `layout`, `sitemap`, `ci`, `deps`

**Examples:**

```
feat(icon): add bell icon
fix(modal): color picker not closing on outside click
meta(sitemap): add priority and changeFrequency
docs(contributing): add vectorEffect rule
chore(ci): fix git push 403 permissions
```

---

## 17. PR Rules

- Branch naming: `icon/<slug>` for new icons, otherwise any descriptive name
- PR title must start with a valid prefix (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`)
- Icon PRs must use `feat: add icon/<slug>` so the CI icon validator runs
- All CI checks must pass before merge
- The PR template in `.github/pull_request_template.md` provides the checklist

---

## 18. License

[MIT](LICENSE) © [Hari](https://github.com/Harijohnson)

---

*This wiki is kept in [wiki.md](wiki.md) at the repo root. Copy the contents of each section into GitHub Wiki pages for the best experience.*
