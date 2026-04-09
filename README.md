# cssvg-icon

Animated SVG icon library for React and Next.js.

**[icon.cssvg.com](https://icon.cssvg.com)** · [npm](https://www.npmjs.com/package/cssvg-icons) · [GitHub](https://github.com/Harijohnson/cssvg-icon) · [Contributing](CONTRIBUTING.md)

---

## Installation

```bash
npm install cssvg-icons
# or
bun add cssvg-icons
```

## Usage

### Named imports (tree-shakeable)

```tsx
import { Heart, Settings, ArrowRight } from "cssvg-icons";

export default function App() {
  return <Heart color="#ffffff" strokeWidth={2} size={40} />;
}
```

### Direct import

```tsx
import HeartIcon from "cssvg-icons/icons/heart/heart";
```

## Props

All icons accept the same props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"currentColor"` | Stroke color |
| `strokeWidth` | `number` | `2` | Stroke width (0.5–4) |
| `size` | `number` | `40` | Width and height in px |
| `className` | `string` | `""` | Extra CSS classes |

## Available Icons

| Name | Import |
|---|---|
| ArrowRight | `import { ArrowRight } from "cssvg-icons"` |
| BellRing | `import { BellRing } from "cssvg-icons"` |
| Download | `import { Download } from "cssvg-icons"` |
| Heart | `import { Heart } from "cssvg-icons"` |
| Minus | `import { Minus } from "cssvg-icons"` |
| Pause | `import { Pause } from "cssvg-icons"` |
| Play | `import { Play } from "cssvg-icons"` |
| Plus | `import { Plus } from "cssvg-icons"` |
| Refresh | `import { Refresh } from "cssvg-icons"` |
| Search | `import { Search } from "cssvg-icons"` |
| Settings | `import { Settings } from "cssvg-icons"` |
| Share | `import { Share } from "cssvg-icons"` |
| StarGrow | `import { StarGrow } from "cssvg-icons"` |
| StarSpin | `import { StarSpin } from "cssvg-icons"` |
| Trash | `import { Trash } from "cssvg-icons"` |
| Upload | `import { Upload } from "cssvg-icons"` |

## Local Development

```bash
git clone https://github.com/Harijohnson/cssvg-icon.git
cd cssvg-icon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
icons/
  [slug]/
    [slug].tsx   # Animated React component
    [slug].json  # Metadata & attribution
    [slug].svg   # Raw SVG source
```

## Contributing

Contributions are welcome — new icons, bug fixes, and docs improvements.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide
- [Open an issue](https://github.com/Harijohnson/cssvg-icon/issues)
- [Browse the icon explorer](https://icon.cssvg.com) to see what's already there

### Adding an icon (quick start)

```bash
git checkout -b icon/<slug>
# add icons/<slug>/<slug>.tsx, icons/<slug>/<slug>.json, icons/<slug>/<slug>.svg
git commit -m "feat: add icon/<slug>"
git push origin icon/<slug>
# open a PR against main
```

## License

[MIT](LICENSE) © [Hari](https://github.com/Harijohnson)
