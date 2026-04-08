# Project Architecture

`cssvg-icon` is built on a modular "Shadow Registry" architecture. Each icon is self-contained in its own directory, allowing for easy discovery, tree-shaking, and external attribution.

```text
/icons
  /[slug]
    ├── [slug].tsx   # The animated React component
    ├── [slug].json  # Detailed metadata & attribution
    └── [slug].svg   # Raw SVG source for copying/downloading
```
