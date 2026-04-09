# cssvg-icons

**Live site: [icon.cssvg.com](https://icon.cssvg.com)**

A professional, scalable, and SEO-ready animated SVG icon system for Next.js and React applications. Designed for developers who value performance, rich aesthetics, and ease of use.

## Links

- [icon.cssvg.com](https://icon.cssvg.com) — Browse & preview all icons
- [Contributing Guide](https://github.com/Harijohnson/cssvg-icon/blob/main/CONTRIBUTING.md) — How to add icons, PR rules, export settings
- [Export Guidelines](https://github.com/Harijohnson/cssvg-icon/blob/main/EXPORT_GUIDELINES.md) — TSX component spec

## Features

- **Highly Performant**: Built-in tree-shaking support ensures only the icons you use are bundled.
- **Smooth Animations**: Built-in hover animations and micro-interactions.
- **SEO Optimized**: Includes dynamic generation and structured data support for search engines.
- **Developer Friendly**: One-click copy for React snippets and SVG source code.
- **Minimalist Aesthetic**: Consistent pure black, white and gray theme that fits modern UI designs.
- **Scalable Registry**: Automatically scans directory structures to discover and register new icons.

## Installation

```bash
# With npm
npm install cssvg-icons

# With bun
bun add cssvg-icons
```

## Local Development (Docs)

If you want to run the icon registry documentation locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Harijohnson/cssvg-icon.git
   cd cssvg-icon
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Start the development server**:

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the documentation.

## Quick Start

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

## Project Architecture

`cssvg-icon` is built on a modular "Shadow Registry" architecture. Each icon is self-contained in its own directory, allowing for easy discovery, tree-shaking, and external attribution.

```text
/icons
  /[slug]
    ├── [slug].tsx   # The animated React component
    ├── [slug].json  # Detailed metadata & attribution
    └── [slug].svg   # Raw SVG source for copying/downloading
```

## Adding New Icons

To add an icon to the registry, create a new folder in `icons/` using the slug name as the folder name.

### 1. Metadata Schema (`[slug].json`)

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

### 2. Implementation (`[slug].tsx`)

Icons should be implemented as functional React components that accept `color`, `size`, and `strokeWidth` props.

### 3. Source (`[slug].svg`)

Provide the raw SVG source code. This is used by the "Copy SVG" and "Download SVG" features in the Icon Detail Modal.

## Design System

The library follows a strict **Monochrome Minimalist** design system:
- **Primary**: `bg-black` (#000000)
- **Secondary**: `text-white` (#FFFFFF)
- **Accents**: `text-zinc-500` (#71717A)
- **Borders**: `border-zinc-800` (#27272A)

## Legal & Support

- **[License](LICENSE)**: MIT License.
- **[Privacy Policy](PRIVACY.md)**: Transparent data usage documentation.
- **[Support](SUPPORT.md)**: Community support and issue reporting.

## License

MIT
