"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Layers,
  ExternalLink,
  Code2,
} from "lucide-react";
import { DOC_NAV } from "@/lib/navigation-data";


export function Sidebar() {
  const pathname = usePathname();

  const navItems: {
    name: string;
    href: string;
    icon: React.ElementType;
    inactive?: boolean;
  }[] = [
    { name: "Icon Explorer", href: "/", icon: LayoutGrid },
  ];

  const resourceItems = [
    { name: "SVG Editor", href: "https://cssvg.com/", icon: Code2 },
  ];

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-[240px] lg:w-[280px] border-r border-zinc-900/50 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
      <div className="h-full py-8 pr-6 pl-4">
        <div className="flex flex-col gap-10">
          
          {/* Project Header */}
          <div className="px-3">
            <h4 className="mb-3 rounded-md bg-white/5 border border-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-fit">
              Project
            </h4>
            <div className="flex items-center gap-3 text-sm font-bold text-white tracking-tight group cursor-default">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Layers className="h-4 w-4 text-white" />
              </div>
              cssvg-icon
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-white/5 text-white font-semibold"
                        : item.inactive 
                          ? "text-zinc-700 cursor-not-allowed"
                          : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "mr-3 h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1 h-4 bg-white rounded-full animate-in fade-in zoom-in-50 duration-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Documentation */}
          <div className="flex flex-col gap-2">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              Documentation
            </div>
            <nav className="space-y-1">
              {DOC_NAV.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 pl-9 text-sm transition-all relative",
                      isActive
                        ? "text-white font-semibold"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              Resources
            </div>
            <nav className="space-y-1">
              {resourceItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center rounded-md px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <item.icon className="mr-3 h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                  {item.name}
                  <ExternalLink className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>
          </div>

        </div>
      </div>
    </aside>
  );
}
