"use client";

import { useState, useMemo, useCallback } from "react";
import { ChromePicker } from "react-color";
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
  const [color, setColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [size, setSize] = useState(56);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [absoluteStroke, setAbsoluteStroke] = useState(false);

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
      <div className="flex justify-center mb-5">
        {/* Search */}
        <div className="flex ms-1/2 max-w-3xl ">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search animated icons..."
          />
        </div>

      </div>
      <div className="flex gap-8 lg:gap-16 items-start">

        {/* Left sidebar controls */}
        <aside className="hidden lg:block w-64 shrink-0 self-start border border-zinc-900 rounded-xl bg-zinc-950 sticky top-24 z-40">
          <div className="p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Controls</h3>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400 block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-600"
                  placeholder="#ffffff"
                />
                <button
                  type="button"
                  onClick={() => setPickerOpen((open) => !open)}
                  className="w-8 h-8 rounded border border-zinc-700"
                  style={{ backgroundColor: color }}
                  aria-label="Open color picker"
                />
              </div>
              {pickerOpen && (
                <div className="relative">
                  <div className="absolute z-40">
                    <div className="rounded-lg overflow-hidden shadow-xl border border-zinc-700">
                      <ChromePicker
                        disableAlpha
                        color={color}
                        onChange={(val) => setColor(val.hex)}
                      />
                      <div className="flex justify-end bg-zinc-900 px-3 py-2 border-t border-zinc-700">
                        <button
                          type="button"
                          onClick={() => setPickerOpen(false)}
                          className="text-xs text-zinc-400 hover:text-white px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Stroke width</span>
                <span className="font-mono text-zinc-300">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.5}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Size</span>
                <span className="font-mono text-zinc-300">{size}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={64}
                step={8}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Absolute stroke width toggle */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <span className="text-xs text-zinc-400 block">Absolute stroke</span>
                <span className="text-[10px] text-zinc-600 block">Scale-independent width</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={absoluteStroke}
                onClick={() => setAbsoluteStroke((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  absoluteStroke ? "bg-white" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-black shadow-lg transform transition-transform ${
                    absoluteStroke ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-6 -900 2xl:pl-8">

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
                  <Card className="bg-black border-zinc-800 hover:border-zinc-600 transition-all duration-200 p-0 flex flex-col items-center justify-center gap-1 aspect-square">
                    <IconRenderer
                      slug={icon.slug}
                      className={cn(
                        "w-5 h-5 text-white transition-transform duration-200",
                        "group-hover:scale-110"
                      )}
                      color={color}
                      strokeWidth={strokeWidth}
                      size={size}
                      absoluteStroke={absoluteStroke}
                    />
                    <span className="text-[8px]  uppercase tracking-wide font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors truncate w-full text-center">
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
      </div>

      <IconDetailModal
        icon={selectedIcon}
        onClose={handleClose}
        color={color}
        strokeWidth={strokeWidth}
        size={size}
        absoluteStroke={absoluteStroke}
        onTagClick={setSearch}
      />
    </>
  );
}
