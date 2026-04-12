"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_NAV } from "@/lib/navigation-data";
import { DocLayout } from "./DocLayout";
import InstallBanner from "./InstallBanner";

interface MarkdownPageProps {
  content: string;
  title: string;
  showInstallBanner?: boolean;
}

export function MarkdownPage({ content, title, showInstallBanner }: MarkdownPageProps) {
  // Extract headings for Table of Contents
  const headings = content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace(/^## /, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return { text, id, depth: 2 };
    });

  const pathname = usePathname();
  const currentIndex = DOC_NAV.findIndex((item) => item.href === pathname);
  const prev = currentIndex > 0 ? DOC_NAV[currentIndex - 1] : null;
  const next = currentIndex < DOC_NAV.length - 1 ? DOC_NAV[currentIndex + 1] : null;

  return (
    <DocLayout headings={headings}>
      <Link href="/" className="flex items-center gap-2 group shrink-0 mb-12">
        <Layers className="w-5 h-5 text-white" />
        <span className="font-bold text-sm text-white hidden sm:block uppercase tracking-wider">cssvg-icon</span>
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-6">
        {title}
      </h1>

      <article className="prose prose-invert prose-zinc max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tighter prose-headings:font-bold prose-h1:text-4xl prose-h1:lg:text-5xl prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-2 prose-a:text-white prose-a:underline-offset-4 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-900 prose-code:text-zinc-300 prose-code:bg-zinc-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-zinc-800 prose-blockquote:text-zinc-500">
        {(() => {
          const mdComponents = {
            h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
              return <h3 id={id} {...props}>{children}</h3>;
            },
          };

          if (!showInstallBanner || !content.includes("## Installation")) {
            return (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {content}
              </ReactMarkdown>
            );
          }

          const splitMarker = "## Installation";
          const splitIndex = content.indexOf(splitMarker);
          const before = content.slice(0, splitIndex);
          const after = content.slice(splitIndex);

          return (
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {before}
              </ReactMarkdown>
              <h2 id="installation" className="border-b border-zinc-900 pb-2 font-bold tracking-tighter scroll-mt-24">
                Installation
              </h2>
              <p className="text-zinc-400 text-sm mt-1 mb-4">Install the package using your preferred package manager:</p>
              <div className="not-prose my-6">
                <InstallBanner />
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {after.replace(/^## Installation\n\nInstall the package using your preferred package manager:\n\n/, "")}
              </ReactMarkdown>
            </>
          );
        })()}
      </article>

      {/* Page Navigation */}
      {(prev || next) && (
        <div className="mt-10 flex flex-col sm:flex-row gap-15 pt-6 border-t border-zinc-900 mb-4">
          {prev ? (
            <Link
              href={prev.href}
              className="flex-1 group flex flex-col gap-0.5 p-2 rounded border border-white/5 bg-white/1 hover:bg-white/3 transition-all hover:border-white/10"
            >
              <div className="flex items-center gap-1 text-zinc-500 text-[9px] font-bold uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                <ChevronLeft className="w-2.5 h-2.5" />
                Prev
              </div>
              <div className="text-zinc-300 font-medium text-xs group-hover:translate-x-1 transition-transform">
                {prev.name}
              </div>
            </Link>
          ) : (
            <div className="flex-1 hidden sm:block" />
          )}

          {next ? (
            <Link
              href={next.href}
              className="flex-1 group flex flex-col gap-0.5 p-2 rounded border border-white/5 bg-white/1 hover:bg-white/3 transition-all items-end text-right hover:border-white/10"
            >
              <div className="flex items-center gap-1 text-zinc-500 text-[9px] font-bold uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                Next
                <ChevronRight className="w-2.5 h-2.5" />
              </div>
              <div className="text-zinc-300 font-medium text-xs group-hover:-translate-x-1 transition-transform">
                {next.name}
              </div>
            </Link>
          ) : (
            <div className="flex-1 hidden sm:block" />
          )}
        </div>
      )}
    </DocLayout>
  );
}
