## PR Type

Select the category that best describes this PR:

- [ ] `feat: add icon/<slug>` — new icon
- [ ] `fix:` — bug fix
- [ ] `chore:` — tooling / CI / dependencies
- [ ] `docs:` — documentation only
- [ ] `refactor:` — code cleanup, no behaviour change
- [ ] `style:` — visual / UI tweak
- [ ] `test:` — tests or CI checks

---

## Description

<!-- What does this PR do? One or two sentences. -->

---

## New Icon Checklist

> Skip this section if this is not an icon PR.

**Files**
- [ ] Folder: `icons/<slug>/` (lowercase, hyphen-separated)
- [ ] `icons/<slug>/<slug>.tsx` added
- [ ] `icons/<slug>/<slug>.json` added
- [ ] No extra files in the icon folder

**JSON**
- [ ] `name` filled (PascalCase)
- [ ] `slug` filled (matches folder & file name exactly)
- [ ] `description` filled (one sentence)
- [ ] `tags` filled (array, min 3 keywords)
- [ ] `credit` filled (your name/handle)

**TSX**
- [ ] `"use client"` at top
- [ ] Props interface exported (`className`, `size`, `color`, `strokeWidth`)
- [ ] Function name is PascalCase, default export
- [ ] `viewBox="0 0 40 40"` (canvas is always 40×40)
- [ ] `stroke={color}` — no hardcoded hex
- [ ] `strokeWidth={strokeWidth}` — no hardcoded numbers
- [ ] SMIL `<animateTransform>` / `<animate>` untouched
- [ ] No background colour on wrapper `<div>`

**Export settings**
- [ ] Canvas was **40×40** in CSSVG Editor
- [ ] Exported as **Animated** (not static)
- [ ] **SVG camelCase toggle OFF** when exporting SVG
- [ ] **TSX camelCase toggle ON** when exporting `.tsx`
