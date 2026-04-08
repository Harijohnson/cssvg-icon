"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface IconRendererProps {
  slug: string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  size?: number;
}

/**
 * A client-side component that dynamically loads an icon based on its slug.
 * This avoids serialization issues when passing components from Server to Client.
 */
export default function IconRenderer({ slug, className, color, strokeWidth, size }: IconRendererProps) {
  // Use useMemo to ensure the dynamic component is only created once per slug
  const DynamicIcon = useMemo(() => {
    return dynamic<any>(() => import(`@/icons/${slug}/${slug}.tsx`), {
      loading: () => <div className={cn("w-8 h-8 bg-zinc-900 rounded-sm animate-pulse", className)} />,
      ssr: true, // Enable SSR for better initial load visibility
    });
  }, [slug]);

  const extraProps: Record<string, unknown> = {};
  if (color) extraProps.style = { color };
  if (strokeWidth !== undefined) extraProps.strokeWidth = strokeWidth;
  if (size !== undefined) {
    extraProps.width = size;
    extraProps.height = size;
  }

  return (
    <DynamicIcon
      className={className}
      {...extraProps}
    />
  );
}
