"use client";

import React, { useState, useMemo, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { Card } from "@/components/ui/card";
import { IconRegistryEntry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import IconDetailModal from "@/components/IconDetailModal";
import { cn } from "@/lib/utils";

interface IconExplorerProps {
  initialIcons: IconRegistryEntry[];
}

export default function IconExplorer({ initialIcons }: IconExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconRegistryEntry | null>(null);

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    return initialIcons.filter((icon) =>
      icon.name.toLowerCase().includes(searchLower) ||
      icon.slug.toLowerCase().includes(searchLower) ||
      icon.description.toLowerCase().includes(searchLower) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }, [search, initialIcons]);

  const handleClose = useCallback(() => setSelectedIcon(null), []);

  return (
    <>
      <div className="space-y-6">
        {/* Search */}
        <div className="flex justify-center max-w-xl mx-auto px-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search animated icons..."
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => (
              <div
                key={icon.slug}
                onClick={() => setSelectedIcon(icon)}
                className="group relative cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Open ${icon.name} icon details`}
                onKeyDown={(e) => e.key === "Enter" && setSelectedIcon(icon)}
              >
                <Card className="bg-black border-zinc-800 hover:border-zinc-600 transition-all duration-200 p-2 flex flex-col items-center justify-center gap-1 aspect-square">
                  <IconRenderer
                    slug={icon.slug}
                    className={cn(
                      "w-5 h-5 text-white transition-transform duration-200",
                      "group-hover:scale-110"
                    )}
                  />
                  <span className="text-[8px] uppercase tracking-wide font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors truncate w-full text-center">
                    {icon.name}
                  </span>
                </Card>

                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                  <div className="relative bg-zinc-800 text-white text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap shadow-lg border border-zinc-700">
                    {icon.name}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[3px] border-x-transparent border-t-[3px] border-t-zinc-800" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-zinc-900 rounded-lg">
              <p className="text-zinc-600 text-sm">No icons match your search.</p>
            </div>
          )}
        </div>
      </div>

      <IconDetailModal icon={selectedIcon} onClose={handleClose} />
    </>
  );
}
