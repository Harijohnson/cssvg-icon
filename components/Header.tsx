"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
              href="https://cssvg.com/"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest hidden lg:block"
            >
              Editor
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
