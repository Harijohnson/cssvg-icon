"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TOCItem {
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings?: TOCItem[];
}

export function TableOfContents({ headings = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      // Find the first entry that is intersecting
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-100px 0% -80% 0%",
      threshold: 0,
    });

    const elements = headings.map((h) => document.getElementById(h.id));
    elements.forEach((el) => {
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return (
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block lg:w-[240px] border-l border-zinc-900/50">
        <div className="h-full py-8 pl-8 pr-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Registry Ready
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Browse the icon library to see details and attribution.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block lg:w-[240px] border-l border-zinc-900/50 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
      <div className="h-full py-8 pl-8 pr-4">
        <h4 className="mb-4 font-bold uppercase tracking-widest text-[10px] text-zinc-500">
          On this page
        </h4>
        <nav className="relative flex flex-col gap-1 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  "relative pl-4 py-2 transition-all duration-200 border-l-2",
                  isActive
                    ? "text-white font-semibold border-white"
                    : "text-zinc-500 hover:text-zinc-300 border-zinc-900"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100,
                      behavior: "smooth",
                    });
                    setActiveId(heading.id);
                    window.history.pushState(null, "", `#${heading.id}`);
                  }
                }}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>

        {/* Playbook Card Inspiration */}
        <div className="mt-12 p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            V1.0.0 Update
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The documentation for cssvg-icon v1.0.0 is now live. Explore the new registry system.
          </p>
          <Link href="/docs" className="block text-center w-full bg-white text-black py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors">
            Read Docs
          </Link>
        </div>
      </div>
    </aside>
  );
}
