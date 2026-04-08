"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface IconRendererProps {
  slug: string;
  className?: string;
}

/**
 * A client-side component that dynamically loads an icon based on its slug.
 * This avoids serialization issues when passing components from Server to Client.
 */
export default function IconRenderer({ slug, className }: IconRendererProps) {
  // Use useMemo to ensure the dynamic component is only created once per slug
  const DynamicIcon = useMemo(() => {
    return dynamic<any>(() => import(`@/icons/${slug}/${slug}.tsx`), {
      loading: () => <div className={cn("w-8 h-8 bg-zinc-900 rounded-sm animate-pulse", className)} />,
      ssr: true, // Enable SSR for better initial load visibility
    });
  }, [slug, className]);

  return <DynamicIcon className={className} />;
}
