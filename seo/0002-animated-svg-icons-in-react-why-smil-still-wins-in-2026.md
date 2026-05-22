---
title: "Animated SVG Icons in React: Why SMIL Still Wins in 2026"
published: false
tags: svg, react, animation, webdev
series: "Animated SVG Icons with CSS"
---

SMIL (Synchronized Multimedia Integration Language) has been part of the SVG specification for decades, yet it remains a powerful, often overlooked tool for animating icons in modern React and Next.js applications. While libraries like Framer Motion and CSS transitions dominate the conversation, SMIL offers a uniquely self-contained, zero-runtime-JavaScript approach that aligns perfectly with the declarative nature of React. Here’s why SMIL still wins in 2026, and how the `cssvg-icons` library leverages it to deliver lightweight, customizable animated icons.

## The SMIL Advantage: No JavaScript Required

One of the most compelling reasons to use SMIL is its independence from JavaScript at runtime. Each icon in `cssvg-icons` is a pure React component that renders an SVG with SMIL animation elements embedded directly inside. This means:

- **Zero client-side animation code**: No need to import animation libraries or write useEffect hooks for simple icon motions.
- **Predictable performance**: SMIL is GPU-accelerated in modern browsers and runs on the compositor thread, avoiding main-thread jank.
- **Bundle-size friendly**: Adding an animated icon doesn’t increase your JavaScript bundle—only the SVG string size grows, which is negligible.

Consider the `Activity` icon. Its pulsing, rotating animation is defined entirely within the SVG using `<animateTransform>` and `<animate>` tags. The React component merely passes props like `color` and `size` down to the SVG. There’s no JavaScript logic to initialize or clean up animations.

```tsx
// icons/activity/activity.tsx (excerpt)
<g>
  <animateTransform
    attributeName="transform"
    type="translate"
    values="20,20;20,20;20,20"
    dur="4s"
    repeatCount="indefinite"
    calcMode="spline"
    keyTimes="0;0.0025;1"
    keySplines="0 0 1 1;0 0 1 1"
    additive="replace"
  />
  <path d="M2 12 L4.49 12 A2 2 0 0 0 6.41 10.54 ..." />
</g>
```

This self-containment makes icons incredibly portable—you can copy an SVG from the library into any project, even plain HTML, and it just works.

## Declarative and Composable with React Props

SMIL animations inside SVG are inherently declarative. You describe *what* should happen (e.g., “rotate from 0 to 360 degrees over 4 seconds”) and the browser handles the *how*. This maps beautifully to React’s component model.

In `cssvg-icons`, each icon component accepts standard props (`color`, `size`, `strokeWidth`) that are applied directly to SVG attributes. Because SMIL elements are part of the SVG DOM, they inherit these props automatically when the SVG is re-rendered. For example, changing the `color` prop updates the `stroke` attribute on all paths, while the SMIL animation continues uninterrupted.

```tsx
// icons/crown/crown.tsx (excerpt)
<path
  d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
  transform="translate(-12, -12)"
  stroke={color}
  strokeWidth={strokeWidth}
  fill="none"
/>
```

This design eliminates the need for CSS custom properties or JavaScript-based style interpolation. The animation logic stays fixed, while visual styling remains dynamic—a clean separation of concerns.

## Fine-Grained Easing Control with Spline Interpolation

SMIL’s `calcMode="spline"` and `keySplines` attributes provide nuanced easing control that rivals CSS bezier curves. Each animation element can have its own easing timeline, enabling complex, multi-stage motions within a single icon.

Take the `Menu` icon: its three horizontal lines don’t just slide—they stretch, rotate, and fade in a coordinated sequence. The SMIL `keyTimes` and `keySplines` define precise easing phases for each transform.

```tsx
// icons/menu/menu.tsx (excerpt)
<g transform="translate(20,11.97) rotate(0,0,0) scale(0.2,0.2)">
  <animateTransform
    attributeName="transform"
    type="scale"
    values="0.2,0.2;0.15,0.15;0.2,0.2"
    dur="2s"
    repeatCount="indefinite"
    calcMode="spline"
    keyTimes="0;0.5;1"
    keySplines="0 0 1 1;0 0 1 1"
    additive="sum"
  />
  <line x1={-50} y1={0} x2={50} y2={0} ... />
</g>
```

This level of control is difficult to achieve with pure CSS animations without bloating your stylesheet. SMIL keeps the easing logic colocated with the SVG geometry, making icons self-documenting.

## Accessibility and Semantics Built In

Because SMIL animations live inside the SVG namespace, they inherit SVG’s accessibility features. The `cssvg-icons` components set `aria-hidden="true"` on the root SVG (since icons are decorative) and use semantic SVG elements like `<g>`, `<path>`, and `<line>`. Screen readers ignore the animated elements, but the structure remains valid.

Moreover, SMIL animations don’t trigger reflows or repaints in the same way JavaScript animations might, reducing the risk of accessibility glitches for users with reduced motion preferences. The animations are hardware-accelerated and run off the main thread, ensuring smooth performance even on low-end devices.

## Why Not CSS or JavaScript Animations?

You might wonder why not use CSS `@keyframes` or a library like Framer Motion. For full-page animations, those tools excel. But for icons, SMIL offers distinct advantages:

- **No CSS class management**: Each icon’s animation is isolated. You don’t need to write BEM-style classes or worry about selector specificity.
- **No JS bundle tax**: A typical icon component is ~2KB (SVG string). Adding Framer Motion would add ~15KB to your bundle for the same effect.
- **Easier theming**: Changing an icon’s color or size is a single prop update. With CSS, you’d need to override inline styles or use CSS variables, which can be brittle with complex SMIL values.

SMIL is also future-proof. Browser support is universal (including IE9+), and the spec is stable. While CSS animations evolve, SMIL remains a reliable, low-level primitive for vector animation.

## Practical Integration in React and Next.js

The `cssvg-icons` library demonstrates how to integrate SMIL icons into a modern React ecosystem:

1. **Dynamic import**: Icons are loaded on demand via Next.js’s `dynamic import()`. The `IconRenderer` component fetches the icon by slug from the server registry.
2. **TypeScript safety**: Each icon has a typed interface (`AnimatedSceneProps`) with optional `size`, `color`, and `strokeWidth`.
3. **Server-side rendering**: SMIL animations work seamlessly with SSR because they’re just SVG strings—no hydration mismatches.

```tsx
// components/IconRenderer.tsx (simplified)
import { useEffect } from 'react';

export default function IconRenderer({ slug }: { slug: string }) {
  const Component = dynamic(
    () => import(`../icons/${slug}/${slug}`).then((mod) => mod.default),
    { suspense: false }
  );

  return <Component />;
}
```

This approach keeps your client bundle lean while giving you access to a growing library of ready-to-use animated icons.

## Conclusion

SMIL may be “old” technology, but its elegance lies in its simplicity and self-containment. For React and Next.js developers, SMIL-based icons offer a performant, accessible, and zero-runtime-cost solution that integrates naturally with component-driven workflows. The `cssvg-icons` library proves that you don’t need heavy animation libraries to bring icons to life—just clean SVG and a little declarative markup.

Explore the full library of animated SVG icons at [https://icon.cssvg.com](https://icon.cssvg.com) and see how SMIL can simplify your next project.