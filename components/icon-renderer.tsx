"use client";

import React, { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

type IconComponentProps = {
  className?: string;
  color?: string;
  strokeWidth?: number;
  size?: number;
};

interface IconRendererProps {
  slug: string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  size?: number;
  absoluteStroke?: boolean;
  /** Pause or play SMIL animations. Default: true (playing) */
  animated?: boolean;
  /** Animation speed multiplier. 1 = normal, 2 = 2× faster, 0.5 = half speed. Default: 1 */
  speed?: number;
  /** When true, animation plays only while hovering the wrapper. Overrides animated. Default: false */
  hoverToAnimate?: boolean;
}

export default function IconRenderer({
  slug,
  className,
  color,
  strokeWidth,
  size,
  absoluteStroke,
  animated = true,
  speed = 1,
  hoverToAnimate = false,
}: IconRendererProps) {
  const DynamicIcon = useMemo(() => {
    return dynamic<IconComponentProps>(() => import(`@/icons/${slug}/${slug}.tsx`), {
      loading: () => <div className={cn("w-8 h-8 bg-zinc-900 rounded-sm animate-pulse", className)} />,
      ssr: false,
    });
  }, [slug, className]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Single effect — runs all DOM patches after the SVG loads or props change.
  // Uses MutationObserver only to detect the SVG being injected, then disconnects
  // immediately so attribute writes don't re-trigger the observer.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let observer: MutationObserver | null = null;

    const patch = () => {
      const svg = wrapper.querySelector("svg") as SVGSVGElement | null;
      if (!svg) return;

      // Disconnect before writing attributes so we don't re-trigger
      observer?.disconnect();
      observer = null;

      // ── vector-effect ──────────────────────────────────────────
      svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse").forEach((el) => {
        if (absoluteStroke) {
          el.setAttribute("vector-effect", "non-scaling-stroke");
        } else {
          el.removeAttribute("vector-effect");
        }
      });

      // ── speed: rewrite dur then restart each animation ─────────
      svg.querySelectorAll("animateTransform, animate, animateMotion").forEach((el) => {
        // Store original dur once
        if (!el.hasAttribute("data-original-dur")) {
          const orig = el.getAttribute("dur");
          if (orig) el.setAttribute("data-original-dur", orig);
        }
        const orig = el.getAttribute("data-original-dur");
        if (orig) {
          const ms = parseDur(orig);
          if (ms > 0) {
            const newDur = `${Math.round(ms / (speed || 1))}ms`;
            el.setAttribute("dur", newDur);
            // Restart so the new dur takes effect immediately
            try { (el as SVGAnimationElement).beginElement?.(); } catch { /* noop */ }
          }
        }
      });

      // ── animated: pause / resume ───────────────────────────────
      // hoverToAnimate starts paused; hover events handle unpause/pause
      if (hoverToAnimate) {
        svg.pauseAnimations();
      } else if (animated) {
        svg.unpauseAnimations();
      } else {
        svg.pauseAnimations();
      }

      // ── Firefox: ensure begin="0s" ─────────────────────────────
      if (navigator.userAgent.includes("Firefox") && !svg.dataset.ffPatched) {
        svg.dataset.ffPatched = "1";
        svg.querySelectorAll("animateTransform, animate, animateMotion").forEach((el) => {
          if (!el.hasAttribute("begin")) el.setAttribute("begin", "0s");
        });
      }
    };

    // Run immediately in case SVG already exists
    patch();

    // If SVG not yet in DOM (still loading), watch for it
    if (!wrapper.querySelector("svg")) {
      observer = new MutationObserver(() => patch());
      observer.observe(wrapper, { childList: true, subtree: true });
    }

    return () => observer?.disconnect();
  }, [slug, absoluteStroke, animated, speed, hoverToAnimate]);

  const extraProps: Record<string, unknown> = {};
  if (color !== undefined) extraProps.color = color;
  if (strokeWidth !== undefined) extraProps.strokeWidth = strokeWidth;
  if (size !== undefined) extraProps.size = size;

  const handleMouseEnter = () => {
    if (!hoverToAnimate) return;
    const svg = wrapperRef.current?.querySelector("svg") as SVGSVGElement | null;
    svg?.unpauseAnimations();
  };

  const handleMouseLeave = () => {
    if (!hoverToAnimate) return;
    const svg = wrapperRef.current?.querySelector("svg") as SVGSVGElement | null;
    svg?.pauseAnimations();
  };

  return (
    <div
      ref={wrapperRef}
      style={{ display: "contents" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DynamicIcon className={className} {...extraProps} />
    </div>
  );
}

/** Parse SMIL dur string like "1s", "500ms", "1.5s" → milliseconds */
function parseDur(dur: string): number {
  if (dur.endsWith("ms")) return parseFloat(dur);
  if (dur.endsWith("s")) return parseFloat(dur) * 1000;
  return 0;
}
