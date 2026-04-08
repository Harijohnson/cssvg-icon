# Usage Guide

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
