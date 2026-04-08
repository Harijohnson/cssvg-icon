# cssvg-icons

A premium, scalable, and SEO-ready animated SVG icon system for Next.js and React applications. Designed for developers who value performance, rich aesthetics, and ease of use.

## ✨ Features

- **🚀 Highly Performant**: Built-in tree-shaking support ensures only the icons you use are bundled.
- **✨ Smooth Animations**: Built-in hover animations and micro-interactions.
- **🔍 SEO Optimized**: Includes dynamic generation and structured data support for search engines.
- **📋 Developer Friendly**: One-click copy for React snippets and SVG source code.
- **🎨 Minimalist Aesthetic**: Consistent pure black, white and gray theme that fits modern UI designs.
- **🔄 Scalable Registry**: Automatically scans directory structures to discover and register new icons.

## 📦 Installation

```bash
# With npm
npm install cssvg-icons

# With bun
bun add cssvg-icons
```

## 🚀 Quick Start

### 1. Simple Usage

Import the icons as named components:

```tsx
import { ArrowIcon } from "cssvg-icons";

export default function App() {
  return (
    <div className="p-10">
      <ArrowIcon className="w-8 h-8 text-black hover:scale-110" />
    </div>
  );
}
```

### 2. Using the Icon Registry (Dynamic)

If you need to iterate through all available icons (e.g., for a gallery), use the registry:

```tsx
import { getIconRegistry } from "cssvg-icons/lib/icons-registry";

async function Gallery() {
  const icons = await getIconRegistry();
  return (
    <div className="grid grid-cols-6 gap-4">
      {icons.map(icon => (
        <label key={icon.slug}>{icon.name}</label>
      ))}
    </div>
  );
}
```

## 🛠️ Adding New Icons

This project uses a folder-based automated registry. To add a new icon:

1. Create a folder in `icons/[slug]/`.
2. Add three files:
   - `[slug].tsx`: The React component (Exported as named export).
   - `[slug].json`: Metadata (name, description, tags).
   - `[slug].svg`: Raw SVG source for downloads/copying.

Example `icon.json`:
```json
{
  "name": "Arrow",
  "slug": "arrow",
  "description": "Animated navigation arrow",
  "tags": ["navigation", "arrow", "direction"]
}
```

## 📄 License

MIT © [hari](https://github.com/Harijohnson)
