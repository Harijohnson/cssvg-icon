# Update Footer

Edit the site footer links, columns, or branding.

## Usage

```
/update-footer
```

---

## Footer File

**`components/Footer.tsx`**

The footer has 4 columns in a `lg:grid-cols-6` grid:

| Column | span | Contents |
|---|---|---|
| Brand | `lg:col-span-2` | Logo, tagline, social icons (GitHub, X, Discord) |
| Library | 1 col | Icon Search `/`, Installation `/docs/getting-started`, Usage `/docs/usage` |
| Documentation | 1 col | All 5 doc page links |
| Resources | 1 col | Privacy, License, Contributing (GitHub), Support |

---

## Common Edits

### Add a link to a column
Find the relevant `<ul>` in `components/Footer.tsx` and add a `<li>`:
```tsx
<li><Link href="/new-page" className="text-zinc-500 hover:text-white text-sm transition-colors">Link Text</Link></li>
```

### Add an external link
```tsx
<li>
  <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-sm transition-colors">
    Link Text
  </a>
</li>
```

### Add a new column
1. Add a new `<div>` block with `<h4>` + `<ul>` after the existing columns
2. Update the grid: change `lg:grid-cols-6` to `lg:grid-cols-7` (or adjust span of brand column)

### Change social links
Social icons are in the brand column — edit the `<a>` tags with the GitHub/X/Discord SVG icons.

---

## Styling Rules

- Column headings: `text-white font-semibold text-sm mb-6 uppercase tracking-widest`
- Links: `text-zinc-500 hover:text-white text-sm transition-colors`
- Background: `bg-black`
- Border top: `border-t border-zinc-900`
- Footer is used on: home page, all icon detail pages, and all other static pages
