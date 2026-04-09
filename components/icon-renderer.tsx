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
}

/**
 * A client-side component that dynamically loads an icon based on its slug.
 * This avoids serialization issues when passing components from Server to Client.
 */
export default function IconRenderer({ slug, className, color, strokeWidth, size, absoluteStroke }: IconRendererProps) {
  // Use useMemo to ensure the dynamic component is only created once per slug
  const DynamicIcon = useMemo(() => {
    return dynamic<IconComponentProps>(() => import(`@/icons/${slug}/${slug}.tsx`), {
      loading: () => <div className={cn("w-8 h-8 bg-zinc-900 rounded-sm animate-pulse", className)} />,
      ssr: false,
    });
  }, [slug, className]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Firefox: add begin="0s" to fix stepped spline animations
  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    if (!isFirefox) return;
    let attempts = 0;
    const patch = () => {
      const svg = wrapperRef.current?.querySelector("svg");
      if (!svg) {
        if (attempts++ < 20) setTimeout(patch, 50);
        return;
      }
      if (svg.dataset.ffPatched) return;
      svg.dataset.ffPatched = "1";
      svg.querySelectorAll("animateTransform, animate, animateMotion").forEach((el) => {
        if (!el.hasAttribute("begin")) el.setAttribute("begin", "0s");
      });
    };
    patch();
  }, [slug]);

  // Absolute stroke: toggle vectorEffect on all stroke elements
  useEffect(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const strokeEls = svg.querySelectorAll("path, circle, line, rect, polyline, polygon, ellipse");
    strokeEls.forEach((el) => {
      if (absoluteStroke) {
        el.setAttribute("vector-effect", "non-scaling-stroke");
      } else {
        el.removeAttribute("vector-effect");
      }
    });
  }, [absoluteStroke, slug]);

  const extraProps: Record<string, unknown> = {};
  if (color !== undefined) extraProps.color = color;
  if (strokeWidth !== undefined) extraProps.strokeWidth = strokeWidth;
  if (size !== undefined) extraProps.size = size;

  return (
    <div ref={wrapperRef} style={{ display: "contents" }}>
      <DynamicIcon
        className={className}
        {...extraProps}
      />
    </div>
  );
}
