# Add New Icon

Add a new animated SVG icon to the cssvg-icon registry.

## Usage

```
/add-icon <slug>
```

Example: `/add-icon bell`

## What this does

Creates the two required files for a new icon and validates them against the project spec.

---

## Steps

### 1. Validate the slug

- Must be **lowercase, hyphen-separated** (e.g. `arrow-right`, `chevron-down`)
- Must not already exist in `icons/`
- Check: `ls icons/<slug>/` — if it exists, stop and tell the user

### 2. Create the folder

```
icons/<slug>/
```

### 3. Create `icons/<slug>/<slug>.json`

Use this schema — ask the user for any missing fields:

```json
{
  "name": "<PascalCase name>",
  "slug": "<slug>",
  "description": "<one sentence describing the icon>",
  "tags": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "credit": "<author name or handle>",
  "link": "<CSSVG share URL if available>",
  "reference": "<source icon URL if applicable>"
}
```

Required fields: `name`, `slug`, `description`, `tags` (min 3), `credit`
Optional: `link`, `reference`

### 4. Create `icons/<slug>/<slug>.tsx`

Ask the user to paste the TSX export from the CSSVG Editor, then validate it:

**Checklist before saving:**
- [ ] `"use client"` at top
- [ ] Props interface exported with `className`, `size`, `color`, `strokeWidth`
- [ ] Default export function, name is PascalCase
- [ ] `viewBox="0 0 40 40"` — canvas must be 40×40
- [ ] `stroke={color}` — no hardcoded hex colours
- [ ] `strokeWidth={strokeWidth}` — no hardcoded numbers
- [ ] SMIL `<animateTransform>` / `<animate>` untouched
- [ ] Wrapper div: `inline-flex items-center justify-center overflow-hidden` with `width: size, height: size, flexShrink: 0`
- [ ] No background colour on wrapper div

If any check fails, tell the user exactly what to fix before saving.

### 5. Verify the icon appears

Run a quick check:
```bash
node -e "const fs=require('fs'); console.log(fs.existsSync('icons/$SLUG/$SLUG.tsx') && fs.existsSync('icons/$SLUG/$SLUG.json') ? '✅ Files exist' : '❌ Missing files')"
```

### 6. Remind the user

- The icon auto-appears in the explorer on next build/refresh — no registry changes needed
- For a PR, branch should be named `icon/<slug>` and PR title `feat: add icon/<slug>`
- See `CONTRIBUTING.md` for full PR guide

---

## Export Settings Reminder

Tell the user these CSSVG Editor settings before they export:

| Setting | Value |
|---|---|
| Canvas | **40 × 40** |
| Export | **Animated** (not static) |
| SVG camelCase toggle | **OFF** |
| TSX camelCase toggle | **ON** |
