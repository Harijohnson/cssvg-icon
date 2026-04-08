"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/CopyButton";
import { IconRegistryEntry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import { cn } from "@/lib/utils";

interface IconExplorerProps {
  initialIcons: IconRegistryEntry[];
}

export default function IconExplorer({ initialIcons }: IconExplorerProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    return initialIcons.filter((icon) => {
      return (
        icon.name.toLowerCase().includes(searchLower) ||
        icon.slug.toLowerCase().includes(searchLower) ||
        icon.description.toLowerCase().includes(searchLower) ||
        icon.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [search, initialIcons]);

  return (
    <div className="space-y-12">
      {/* Search Bar Section */}
      <div className="flex justify-center max-w-2xl mx-auto px-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="Search animated icons..."
        />
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.length > 0 ? (
          filteredIcons.map((icon) => {
            const reactUsage = `<${icon.name}Icon />`;
            
            return (
              <Link 
                key={icon.slug} 
                href={`/icons/${icon.slug}`}
                className="group relative"
              >
                <Card
                  className="bg-black border-zinc-800 hover:border-zinc-600 transition-all duration-300 p-4 flex flex-col items-center justify-center aspect-square"
                >
                  {/* Icon Preview */}
                  <div className="flex-1 flex items-center justify-center mb-2">
                    <IconRenderer 
                      slug={icon.slug}
                      className={cn(
                        "w-8 h-8 text-white transition-transform duration-300",
                        "group-hover:scale-125 group-hover:rotate-6"
                      )} 
                    />
                  </div>

                  {/* Icon Name */}
                  <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors truncate w-full text-center">
                    {icon.name}
                  </span>

                  {/* Action Overlays */}
                  <div className="absolute inset-x-2 top-2 bottom-6 opacity-0 group-hover:opacity-100 bg-black/90 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-700">
                    <div className="flex flex-col gap-1.5 w-full px-4">
                      <CopyButton 
                        content={reactUsage}
                        label="React"
                        size="xs"
                        variant="secondary"
                        toastMessage="React snippet copied"
                        className="w-full text-[10px] h-7 bg-white text-black hover:bg-zinc-200"
                      />
                      <CopyButton 
                        content={icon.svgPath}
                        label="SVG"
                        size="xs"
                        variant="outline"
                        toastMessage="SVG source copied"
                        className="w-full text-[10px] h-7 border-zinc-700 text-zinc-300 hover:text-white"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 font-medium">No icons match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
