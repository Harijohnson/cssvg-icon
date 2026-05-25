---
title: "Animated Bell Icon: Anatomy of a SMIL Ringing Animation"
published: false
tags: svg, smil, animation, icons
series: "Animated SVG Icons with CSS"
---

## Introduction: Why SMIL for Animated Icons?

When building a library of animated SVG icons, the choice of animation technology is critical. CSSVG Icons uses **SMIL (Synchronized Multimedia Integration Language)**—an XML-based language native to SVG—because it offers declarative, per-element control without external dependencies. Unlike CSS animations that apply to entire elements, SMIL lets us animate individual attributes (like `transform`, `stroke-dashoffset`, or `opacity`) with precise timing and easing, all within the SVG itself.

For a bell icon, SMIL’s ability to chain multiple transforms—rotation, translation, and scaling—with different easing curves creates a natural, physics-inspired ringing motion. This post breaks down a hypothetical bell icon’s SMIL animation, using real patterns from the CSSVG codebase (like the `search` and `menu` icons) to explain the *why* behind each decision.

---

## The Bell’s Anatomy: SVG Structure for Animation

A ringing bell requires two main moving parts: the **bell body** (swinging back and forth) and the **clapper** (striking the bell). In SVG, we group these elements to animate them independently:

```tsx
// Hypothetical bell icon structure (inspired by CSSVG patterns)
<svg viewBox="0 0 40 40">
  <g id="bell-body">
    <path d="M10,30 Q20,10 30,30" ... />
    <animateTransform 
      attributeName="transform" 
      type="rotate" 
      values="0,20,30; 20,20,30; -10,20,30; 0,20,30" 
      dur="1.5s" 
      repeatCount="indefinite"
      additive="sum"
      keyTimes="0; 0.5; 0.75; 1"
      keySplines="0.25 0.1 0.25 1; 0.5 0 0.5 1; 0.25 0.1 0.25 1"
    />
  </g>
  <g id="clapper">
    <circle cx="20" cy="25" r="3" ... />
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values="0,0; 0,5; 0,0" 
      dur="0.8s" 
      repeatCount="indefinite"
      additive="sum"
      keyTimes="0; 0.5; 1"
      keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
    />
  </g>
</svg>
```

**Why this structure?**  
Grouping the bell body and clapper separately allows independent animation loops. The `additive="sum"` property is crucial—it combines the clapper’s vertical movement with the bell’s rotation, making the clapper swing *relative* to the bell’s tilt. Without additive transforms, the clapper would move in absolute coordinates, breaking the illusion of a single mechanical system.

---

## Decoding the Swing: `keyTimes` and Pendulum Physics

The bell’s rotation follows a pendulum-like arc. The `keyTimes` attribute defines the animation’s timeline, while `keySplines` control easing between keyframes.

```xml
<animateTransform 
  attributeName="transform" 
  type="rotate" 
  values="0,20,30; 20,20,30; -10,20,30; 0,20,30"
  keyTimes="0; 0.5; 0.75; 1"
  keySplines="0.25 0.1 0.25 1; 0.5 0 0.5 1; 0.25 0.1 0.25 1"
/>
```

**Why these values?**  
- **`values`**: The rotation pivots around `(20,30)` (the bell’s top). The sequence `0 → 20° → -10° → 0°` mimics a bell’s natural swing: it starts at rest, swings forward (positive rotation), then backward past center due to momentum, and finally settles.
- **`keyTimes`**: The animation spends `50%` of the time reaching the forward peak (`20°`), `25%` swinging back to `-10°` (overshoot), and `25%` returning to center. This asymmetry reflects real physics—a bell loses energy as it swings, so the forward stroke is slower than the return.
- **`keySplines`**: The cubic-bezier curves create “slow-in, slow-out” motion. The first spline (`0.25 0.1 0.25 1`) eases into the forward swing, the second (`0.5 0 0.5 1`) accelerates the backswing, and the third mirrors the first for settling. This avoids mechanical, linear motion.

**Comparison to CSSVG’s `search` icon:**  
The `search` icon uses similar splines for its scanning motion (`keySplines="0 0 1 1"` for constant speed), but the bell requires variable speed to feel organic. The `menu` icon’s scaling (`keySplines="0 0 1 1"`) is linear because it’s a simple morph, not a physics-based swing.

---

## The Clapper’s Strike: Additive Translation and Timing

The clapper must move independently of the bell’s rotation. Its `translate` animation is set to `additive="sum"` so it compounds with the bell’s transform:

```xml
<animateTransform 
  attributeName="transform" 
  type="translate" 
  values="0,0; 0,5; 0,0" 
  additive="sum"
/>
```

**Why additive?**  
If the bell rotates `20°` and the clapper translates `5px` downward, `additive="sum"` applies both transforms to the clapper’s coordinate space. Without it, the clapper would move relative to the SVG’s origin, not the bell’s tilted position.

**Timing the strike:**  
The clapper’s `0.8s` loop is shorter than the bell’s `1.5s` loop. This offset creates a realistic ringing pattern: the clapper strikes the bell at the peak of its forward swing, then again as the bell swings back. The `keySplines="0.42 0 0.58 1"` (a standard “ease-in-out”) gives the clapper a quick strike and immediate rebound.

---

## Layering Transforms: Rotation + Translation for Realism

A bell doesn’t just rotate—its pivot point shifts slightly as it swings. We combine `rotate` and `translate` using multiple `<animateTransform>` elements with `additive="sum"`:

```xml
<g transform="translate(20,30)">
  <animateTransform type="rotate" ... /> 
  <animateTransform type="translate" values="0,0; 0,2; 0,0" ... />
</g>
```

**Why both?**  
The `translate` animation adds a subtle vertical bob to the bell’s pivot, simulating the slight lift at the end of a swing. This mimics a real bell’s motion: as it swings forward, the pivot point rises slightly due to the rope’s tension. The `search` icon uses a similar combo (`translate` + `rotate`) for its magnifier’s arc, but the bell’s translation is smaller and faster.

---

## Math Behind the Motion: Sine Waves vs. Keyframes

Could we use a sine wave instead of keyframes? SMIL doesn’t support `calc()` for complex easing, so keyframes with `keySplines` are more flexible. However, the underlying math is similar:

```
rotation(t) = A * sin(2πt/T + φ)
```

Where:
- `A` = amplitude (20°)
- `T` = period (1.5s)
- `φ` = phase shift (to align with clapper strike)

The `keyTimes` and `keySplines` approximate this sine wave with manual control points. For example, the bell’s forward swing (`0 → 20°`) covers `50%` of the time, matching the sine wave’s first half-cycle. The overshoot (`20° → -10°`) adds a decay factor, like friction.

**Why not pure sine?**  
Real bells don’t swing in perfect harmonic motion—they lose energy and overshoot. Keyframes let us tweak each segment (acceleration, overshoot, settle) independently, which a single sine function can’t achieve.

---

## Practical Takeaways: Applying These Patterns

You can reuse these SMIL patterns in your own icons:

1. **For pendulum motion**:  
   Use `rotate` with asymmetric `keyTimes` (e.g., `0; 0.6; 0.8; 1`) and `keySplines` that ease in/out. Offset the clapper’s loop for striking.

2. **For layered transforms**:  
   Combine `rotate` and `translate` with `additive="sum"` to create complex motion (e.g., a bouncing icon that rotates while translating).

3. **For organic easing**:  
   Avoid `keySplines="0 0 1 1"` (linear) for natural motion. Use `0.25 0.1 0.25 1` for slow-start/slow-stop, or `0.5 0 0.5 1` for acceleration.

4. **For independent loops**:  
   Give different elements different `dur` values and `repeatCount="indefinite"`. The `menu` icon’s lines have a `2s` loop, while the `search` icon’s magnifier has a `4s` loop—both offset for visual interest.

---

## Conclusion: The Power of Declarative SMIL

The bell icon’s ringing animation demonstrates SMIL’s strength: fine-grained, physics-inspired motion without JavaScript. By combining `keyTimes`, `keySplines`, and `additive` transforms, we create a believable mechanical system. These patterns are reusable across CSSVG’s icon library—whether it’s a bell, a swinging lantern, or a bouncing ball.

To see these principles in action, explore the full collection at **[cssvg.com](https://icon.cssvg.com)**. Every icon is a study in efficient, declarative animation—ready to drop into your React or Next.js project.