# Adding New Icons

Follow these steps to contribute a new icon to the registry.

---

## Step 1 — Fork the repository

Go to [github.com/Harijohnson/cssvg-icon](https://github.com/Harijohnson/cssvg-icon) and click **Fork** to create your own copy.

Then clone your fork locally:

```bash
git clone https://github.com/<your-username>/cssvg-icon.git
cd cssvg-icon
```

Install dependencies:

```bash
npm install
```

---

## Step 2 — Create a branch

Use the icon slug as the branch name:

```bash
git checkout -b icon/<slug>
```

Example:

```bash
git checkout -b icon/bell
```

---

## Step 3 — Create the icon files

Under `icons/` create a folder named after the slug and add three files:

```
icons/
  bell/
    bell.tsx    ← animated React component
    bell.json   ← metadata
    bell.svg    ← raw SVG source
```

All three files **must share the exact same name** as the folder (the slug).

### Folder & file naming rules

- Slug format: **lowercase, hyphen-separated** — e.g. `arrow-right`, `chevron-down`
- No spaces, no underscores, no camelCase

```
✅  icons/arrow-right/arrow-right.tsx
✅  icons/arrow-right/arrow-right.json
❌  icons/ArrowRight/ArrowRight.tsx
❌  icons/arrow_right/arrow_right.tsx
```

---

## Step 4 — Export from CSSVG Editor

Go to [cssvg.com](https://cssvg.com) and design or open your icon.

**Export settings:**

| Setting | Value |
|---|---|
| Canvas size | **40 × 40** |
| Export format | **Animated** (not static) |
| SVG camelCase toggle | **OFF** |
| TSX camelCase toggle | **ON** |
Paste the `.tsx` output into `icons/<slug>/<slug>.tsx`.

---

## Step 5 — Fill in the metadata (`[slug].json`)

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
| `name` | ✅ | Title case readable name |
| `slug` | ✅ | Matches folder and file name exactly |
| `description` | ✅ | One sentence describing the icon |
| `tags` | ✅ | Lowercase search keywords (min 3) |
| `credit` | ✅ | Your name or handle |
| `link` | optional | CSSVG share URL |
| `reference` | optional | Source icon reference URL |

---

## Step 6 — Commit and push

```bash
git add icons/bell/
git commit -m "feat: add icon/bell"
git push origin icon/bell
```

---

## Step 7 — Open a Pull Request

Go to your fork on GitHub and open a PR against the `main` branch of the original repo. Use the PR title format:

```
feat: add icon/<slug>
```

The PR template will guide you through the checklist before merge.
