"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-zinc-800 bg-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image
            src="/logo.png"
            alt="cssvg-icon Logo"
            width={32}
            height={32}
            priority
            className="rounded-sm"
          />
          <span className="font-bold text-sm text-white block uppercase tracking-wider">cssvg-icon</span>
        </Link>

        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Search Placeholder - Hidden on Home Page */}

          <nav className="flex items-center gap-6 shrink-0">
            <Link
              href="/docs"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/requests"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Requests
            </Link>
            <Link
              href="https://cssvg.com/projects"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest hidden lg:block"
            >
              Editor
            </Link>
            <Link
              href="https://github.com/Harijohnson/cssvg-icon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </Link>
          </nav>
        </div>

        <button className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
