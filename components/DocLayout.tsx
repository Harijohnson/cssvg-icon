"use client";

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";

interface DocLayoutProps {
  children: React.ReactNode;
  headings?: { text: string; id: string }[];
}

export function DocLayout({ children, headings }: DocLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        {/* Left Sidebar - Only visible on Desktop */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-6 py-12 lg:py-16">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
          <Footer />
        </main>

        {/* Right Sidebar - Only visible on Large Desktop */}
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
