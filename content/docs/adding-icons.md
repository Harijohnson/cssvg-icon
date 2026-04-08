# Adding New Icons

To add an icon to the registry, create a new folder in `icons/` using the slug name as the folder name.

## 1. Metadata Schema (`[slug].json`)

The JSON file defines how the icon appears in the explorer and its legal attribution.

```json
{
  "name": "Arrow",                // Readable name
  "slug": "arrow",               // URL-safe identifier
  "description": "Animated...",   // Brief description
  "tags": ["arrow", "nav"],      // Searchable keywords
  "credit": "Hari",               // Author name
  "link": "https://cssvg.com/",  // Author's direct link
  "reference": "https://..."      // Source registry reference
}
```

## 2. Implementation (`[slug].tsx`)

Icons should be implemented as functional React components that accept `color`, `size`, and `strokeWidth` props.

## 3. Source (`[slug].svg`)

Provide the raw SVG source code. This is used by the "Copy SVG" and "Download SVG" features in the Icon Detail Modal.
