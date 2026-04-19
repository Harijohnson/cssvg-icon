# Usage Guide

## Quick Start

### 1. Simple Usage

Import any icon directly by slug:

```tsx
import Pen from "cssvg-icons/pen";

export default function App() {
  return (
    <Pen color="#ffffff" strokeWidth={2} size={40} />
  );
}
```

Or import as a named export:

```tsx
import { Pen, BellRing, ArrowRight } from "cssvg-icons";
```

---

## Props

All icon components accept the following props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string` | `"currentColor"` | Stroke colour — any valid CSS colour |
| `strokeWidth` | `number` | `2` | Stroke width in px |
| `size` | `number` | `40` | Width and height in px |
| `className` | `string` | `""` | Extra CSS classes on the wrapper div |

> Animation control props (`animated`, `hoverToAnimate`) are available via `withIconControls` — see the [Animation Control](#animation-control) section below.

---

## Animation Control

Icons animate continuously by default. Use `withIconControls` to add animation control props without modifying the original icon components.

### `withIconControls` HOC

Wrap any icon to unlock `animated` and `hoverToAnimate` props:

```tsx
import Pen from "cssvg-icons/pen";
import { withIconControls } from "cssvg-icons";

const ControlledPen = withIconControls(Pen);

export default function App() {
  return <ControlledPen color="#ffffff" strokeWidth={2} size={120} />;
}
```

### `animated` — pause / play

```tsx
const ControlledPen = withIconControls(Pen);

// Paused on mount
<ControlledPen animated={false} />

// Playing (default)
<ControlledPen animated={true} />
```

### `hoverToAnimate` — play only on hover

```tsx
const ControlledPen = withIconControls(Pen);

// Starts paused, plays while hovered
<ControlledPen hoverToAnimate />
```

### Animation Control Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | `false` freezes the animation on mount |
| `hoverToAnimate` | `boolean` | `false` | Starts paused, plays only while hovered |

> `hoverToAnimate` takes priority over `animated`. When both are set, hover behaviour wins.

---

## Copy from the UI

Every icon's detail page and the explorer modal show a live code snippet that reflects your current settings. Toggle **Pause**, **Hover**, speed, color and size — the snippet updates instantly and can be copied with one click.

---

## Using the Icon Registry (Dynamic)

If you need to iterate through all available icons (e.g., for a gallery), use the server-side registry:

```tsx
import { getIconRegistry } from "cssvg-icons/lib/icons-registry";

async function Gallery() {
  const icons = await getIconRegistry();
  return (
    <div className="grid grid-cols-6 gap-4">
      {icons.map(icon => (
        <span key={icon.slug}>{icon.name}</span>
      ))}
    </div>
  );
}
```
