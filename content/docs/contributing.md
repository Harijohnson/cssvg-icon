# Contributing

Thank you for contributing to cssvg-icons! This guide covers everything you need to add icons, fix bugs, or improve docs.

---

## PR Categories

Label your PR title with one of these prefixes:

| Prefix | When to use | Example |
|---|---|---|
| `feat: add icon/` | Adding a new icon | `feat: add icon/bell` |
| `fix:` | Bug fix in an existing icon or component | `fix: arrow-right animation flicker` |
| `chore:` | Tooling, config, CI, dependencies | `chore: update eslint config` |
| `docs:` | README, CONTRIBUTING, or inline doc changes | `docs: update contributing guide` |
| `refactor:` | Code cleanup with no behaviour change | `refactor: simplify icon-renderer` |
| `style:` | Visual/UI tweaks that don't affect logic | `style: adjust modal padding` |
| `test:` | Adding or fixing tests / CI checks | `test: add icon file validation workflow` |

> PRs that add icons **must** use the `feat: add icon/` prefix so the CI validator runs correctly.

---

## Adding a New Icon

### Step 1 — Create a branch

Branch naming convention: `icon/<slug>`

```bash
git checkout -b icon/bell
```

Use the icon slug (lowercase, hyphen-separated) as the branch name.

### Step 2 — Create the icon files

Under `icons/` create a folder named after the slug and add three files:

```
icons/
  bell/
    bell.tsx    ← animated React component
    bell.json   ← metadata
    bell.svg    ← raw SVG source
```

All three files **must share the exact same name** as the folder (the slug).

### Step 3 — Export from CSSVG Editor

Go to [cssvg.com](https://cssvg.com) and design or open your icon.

**Editor export settings:**

| Setting | Value |
|---|---|
| Canvas size | **40 × 40** |
| Export format | **Animated** (not static) |
| SVG camelCase toggle | **OFF** |
| TSX camelCase toggle | **ON** |

After exporting, paste the `.tsx` content into `icons/<slug>/<slug>.tsx` and fill in `icons/<slug>/<slug>.json`.

### Step 4 — Create the PR

```bash
git add icons/bell/
git commit -m "feat: add icon/bell"
git push origin icon/bell
```

Then open a PR on GitHub against `main`. The PR template will guide you through the checklist.

---

## Icon File Rules

### Folder & file naming

- Folder name = slug = file name (no exceptions)
- Slug format: **lowercase, hyphen-separated** — e.g. `arrow-right`, `chevron-down`
- No spaces, no underscores, no camelCase in file/folder names

```
✅  icons/arrow-right/arrow-right.tsx
✅  icons/arrow-right/arrow-right.json
❌  icons/ArrowRight/ArrowRight.tsx
❌  icons/arrow_right/arrow_right.tsx
```

---

## JSON Metadata Schema

```json
{
  "name": "Bell",
  "slug": "bell",
  "description": "Animated bell notification icon",
  "tags": ["bell", "notification", "alert", "ring"],
  "credit": "Your Name",
  "link": "https://cssvg.com/share/YOUR_SHARE_ID",
  "reference": "https://lucide.dev/icons/bell"
}
```

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Title case readable name — e.g. `Bell Ring` |
| `slug` | ✅ | Lowercase hyphen-separated, matches folder/file name |
| `description` | ✅ | One sentence describing the icon |
| `tags` | ✅ | Array of lowercase search keywords (min 3) |
| `credit` | ✅ | Your name or handle |
| `link` | optional | CSSVG share URL for the animation |
| `reference` | optional | Source icon reference URL |

---

## TSX Component Rules

```tsx
"use client";

export interface BellProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Bell({
  className = "",
  size = 40,
  color = "currentColor",
  strokeWidth = 2,
}: BellProps = {}) {
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
        {/* SMIL animations + paths */}
      </svg>
    </div>
  );
}
```

**Hard rules:**

- `viewBox` must be `"0 0 40 40"` — canvas is always 40×40
- `stroke` must use `{color}` prop — never hardcoded hex
- `strokeWidth` must use `{strokeWidth}` prop — never hardcoded numbers
- SMIL `<animateTransform>` and `<animate>` elements must be kept exactly as exported
- No background colours on the wrapper div

---

## PR Checklist

Verify before submitting:

**Files**
- [ ] Folder name matches slug (lowercase, hyphen-separated)
- [ ] `icons/<slug>/<slug>.tsx` exists
- [ ] `icons/<slug>/<slug>.json` exists
- [ ] `icons/<slug>/<slug>.svg` exists
- [ ] No extra files added to the icon folder

**JSON**
- [ ] `name`, `slug`, `description`, `tags`, `credit` are all filled in
- [ ] `slug` matches the folder and file name exactly

**TSX**
- [ ] `"use client"` at top
- [ ] Props interface exported with all 4 props
- [ ] Function name is PascalCase and matches the icon name
- [ ] `viewBox="0 0 40 40"`
- [ ] `stroke={color}` — no hardcoded hex colours
- [ ] `strokeWidth={strokeWidth}` — no hardcoded numbers
- [ ] SMIL animations untouched
- [ ] No background colour on wrapper div

**Export settings used**
- [ ] Canvas was 40×40 in CSSVG Editor
- [ ] Exported as Animated (not static)
- [ ] SVG camelCase toggle was OFF
- [ ] TSX camelCase toggle was ON
