"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Download, Copy, Check } from "lucide-react";
import { ChromePicker } from "react-color";
import { IconRegistryEntry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

type Tab = "react" | "vue" | "svelte" | "name";

function getSnippet(
  tab: Tab,
  icon: IconRegistryEntry,
  color: string,
  strokeWidth: number,
  size: number,
  animated: boolean,
  speed: number,
): string {
  const componentName = icon.name.replace(/\s+/g, "");
  const animatedProp = !animated ? `\n      animated={false}` : "";
  const speedProp = speed !== 1 ? `\n      speed={${speed}}` : "";
  switch (tab) {
    case "react":
      return `import ${componentName} from "cssvg-icons/${icon.slug}";

export default function App() {
  return (
    <${componentName}
      color="${color}"
      strokeWidth={${strokeWidth}}
      size={${size}}${animatedProp}${speedProp}
    />
  );
}`;
    case "vue":
      return `<script setup>
import ${componentName} from "cssvg-icons/${icon.slug}";
</script>

<template>
  <${componentName}
    color="${color}"
    :stroke-width="${strokeWidth}"
    :size="${size}"${!animated ? `\n    :animated="false"` : ""}${speed !== 1 ? `\n    :speed="${speed}"` : ""}
  />
</template>`;
    case "svelte":
      return `<script>
  import ${componentName} from "cssvg-icons/${icon.slug}";
</script>

<${componentName}
  color="${color}"
  strokeWidth={${strokeWidth}}
  size={${size}}${!animated ? `\n  animated={false}` : ""}${speed !== 1 ? `\n  speed={${speed}}` : ""}
/>`;
    case "name":
      return componentName;
  }
}

const TABS: { key: Tab; label: string }[] = [
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "svelte", label: "Svelte" },
  { key: "name", label: "Component Name" },
];

export default function IconUsagePage({ icon }: { icon: IconRegistryEntry }) {
  const [color, setColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [size, setSize] = useState(120);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("react");
  const [copied, setCopied] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);

  const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 3];

  const snippet = getSnippet(activeTab, icon, color, strokeWidth, size, animated, speed);

  const copy = () => {
    navigator.clipboard.writeText(snippet);
    toast.success("Copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(icon.svgPath, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("stroke", color);
      svgEl.setAttribute("stroke-width", String(strokeWidth));
      svgEl.setAttribute("width", String(size));
      svgEl.setAttribute("height", String(size));
    }
    const svg = svgEl ? svgEl.outerHTML : icon.svgPath;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">

        {/* ── Left: Preview + Controls ── */}
        <div className="space-y-5 lg:sticky lg:top-28">
          {/* Preview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center aspect-square max-w-xs mx-auto lg:max-w-full">
            <IconRenderer slug={icon.slug} color={color} strokeWidth={strokeWidth} size={size} animated={animated} speed={speed} />
          </div>

          {/* Controls */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Controls</h3>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setPickerOpen((o) => !o)}
                  className="w-8 h-8 rounded border border-zinc-700 shrink-0"
                  style={{ backgroundColor: color }}
                  aria-label="Open color picker"
                />
              </div>
              {pickerOpen && (
                <div className="relative z-20">
                  <div className="absolute top-1">
                    <div className="rounded-lg overflow-hidden shadow-xl border border-zinc-700">
                      <ChromePicker disableAlpha color={color} onChange={(v) => setColor(v.hex)} />
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

            {/* Stroke Width */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Stroke width</span>
                <span className="font-mono text-zinc-300">{strokeWidth}px</span>
              </div>
              <input
                type="range" min={0.5} max={4} step={0.5} value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Size</span>
                <span className="font-mono text-zinc-300">{size}px</span>
              </div>
              <input
                type="range" min={16} max={200} step={8} value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Animated */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400">Animated</span>
              <button
                type="button"
                onClick={() => setAnimated((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              >
                {animated ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {animated ? "Pause" : "Play"}
              </button>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 block">Speed</span>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                      speed === s ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={downloadSvg}
              variant="outline"
              className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300 h-9 text-xs font-semibold flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Download SVG
            </Button>
            {icon.link && (
              <a
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/50 hover:bg-blue-950 border border-blue-800/50 transition-colors py-2 rounded-md"
              >
                Want more customization?
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* ── Right: Info + Code ── */}
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {icon.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-white">{icon.name}</h1>
            {icon.description && (
              <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">{icon.description}</p>
            )}
          </div>

          {/* Code block */}
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-zinc-800 bg-zinc-950">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                    activeTab === t.key
                      ? "text-white border-white"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Code */}
            <div className="relative group bg-zinc-900/40">
              <pre className="p-5 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto min-h-[160px]">
                <code>{snippet}</code>
              </pre>
              <button
                onClick={copy}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Icon details */}
          {(icon.credit || icon.reference) && (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Details</h3>
              {icon.credit && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Author</span>
                  <span className="text-zinc-300 font-medium">{icon.credit}</span>
                </div>
              )}
              {icon.reference && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Reference</span>
                  <a href={icon.reference} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors">
                    Source Registry
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Request a variant */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Missing something?</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Need a variant of <span className="text-zinc-300 font-medium">{icon.name}</span> or a different style? Open a GitHub issue and we&apos;ll add it to the queue.
            </p>
            <a
              href={`https://github.com/Harijohnson/cssvg-icon/issues/new?template=icon-request.md&title=Icon+request:+${encodeURIComponent(icon.name)}+variant&labels=icon-request`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/50 hover:bg-blue-950 border border-blue-800/50 transition-colors"
            >
              Request a variant
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
