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
  animated?: boolean;
  speed?: number;
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
  const absoluteStrokeRef = useRef(absoluteStroke);
  absoluteStrokeRef.current = absoluteStroke;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let loadObserver: MutationObserver | null = null;

    const patch = () => {
      const svg = wrapper.querySelector("svg") as SVGSVGElement | null;
      if (!svg) return;

      loadObserver?.disconnect();
      loadObserver = null;

      // ── vector-effect ──────────────────────────────────────────
      svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse").forEach((el) => {
        if (absoluteStrokeRef.current) {
          el.setAttribute("vector-effect", "non-scaling-stroke");
        } else {
          el.removeAttribute("vector-effect");
        }
      });

      // ── draw-on fix: remove strokeDashoffset so SMIL is sole controller ──
      svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse").forEach((el) => {
        if (el.hasAttribute("stroke-dasharray") && el.hasAttribute("stroke-dashoffset")) {
          el.removeAttribute("stroke-dashoffset");
        }
      });

      // ── speed: rewrite dur ────────────────────────────────────
      const isFirstPatch = !svg.dataset.patched;
      svg.dataset.patched = "1";

      svg.querySelectorAll("animateTransform, animate, animateMotion").forEach((el) => {
        if (!el.hasAttribute("data-original-dur")) {
          const orig = el.getAttribute("dur");
          if (orig) el.setAttribute("data-original-dur", orig);
        }
        const orig = el.getAttribute("data-original-dur");
        if (!orig) return;
        const ms = parseDur(orig);
        if (ms <= 0) return;
        const newDur = `${Math.round(ms / (speed || 1))}ms`;
        el.setAttribute("dur", newDur);
        if (!isFirstPatch) {
          try { (el as SVGAnimationElement).beginElement?.(); } catch { /* noop */ }
        }
      });

      // ── animated: pause / resume ───────────────────────────────
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

    patch();

    if (!wrapper.querySelector("svg")) {
      loadObserver = new MutationObserver(() => patch());
      loadObserver.observe(wrapper, { childList: true, subtree: true });
    }

    return () => loadObserver?.disconnect();
  }, [slug, animated, speed, hoverToAnimate]);

  // ── absoluteStroke: only touches vector-effect, never restarts animation ──
  useEffect(() => {
    const svg = wrapperRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse").forEach((el) => {
      if (absoluteStroke) {
        el.setAttribute("vector-effect", "non-scaling-stroke");
      } else {
        el.removeAttribute("vector-effect");
      }
    });
  }, [absoluteStroke]);

  useEffect(() => {
    const svg = wrapperRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse").forEach((el) => {
      if (el.hasAttribute("stroke-dasharray") && el.hasAttribute("stroke-dashoffset")) {
        el.removeAttribute("stroke-dashoffset");
      }
    });
  }, [color, strokeWidth, size]);

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
    if (!svg) return;
    const anims = svg.querySelectorAll("animateTransform, animate, animateMotion");
    let maxDurMs = 0;
    anims.forEach((el) => {
      const dur = el.getAttribute("dur") ?? el.getAttribute("data-original-dur");
      if (dur) maxDurMs = Math.max(maxDurMs, parseDur(dur));
    });
    if (maxDurMs > 0) svg.setCurrentTime((maxDurMs - 1) / 1000);
    svg.pauseAnimations();
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
