"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { X, ArrowUpRight, Download, Play, Pause, MousePointer } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { IconRegistryEntry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";

interface IconDetailModalProps {
  icon: IconRegistryEntry | null;
  onClose: () => void;
  color: string;
  strokeWidth: number;
  size: number;
  absoluteStroke?: boolean;
  onTagClick?: (tag: string) => void;
}

export default function IconDetailModal(props: IconDetailModalProps) {
  if (!props.icon) return null;
  return <ModalContent key={props.icon.slug} {...props} icon={props.icon} />;
}

function ModalContent({
  icon,
  onClose,
  color,
  strokeWidth,
  size,
  absoluteStroke,
  onTagClick,
}: IconDetailModalProps & { icon: IconRegistryEntry }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [hoverToAnimate, setHoverToAnimate] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  }, [onClose]);

  const copyJsx = () => {
    const name = icon.name.replace(/\s+/g, "");
    const hoverProp = hoverToAnimate ? " hoverToAnimate" : "";
    const animProp = !animated && !hoverToAnimate ? " animated={false}" : "";
    navigator.clipboard.writeText(
      `<${name} color="${color}" strokeWidth={${strokeWidth}} size={${size}}${hoverProp}${animProp} />`
    );
    toast.success("JSX copied");
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
    const blob = new Blob([svgEl ? svgEl.outerHTML : icon.svgPath], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 3];
  const previewSize = Math.max(size, 80);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-[80vw] bg-zinc-950 border-t border-x border-zinc-800 rounded-t-2xl animate-in slide-in-from-bottom duration-200">

        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-8 h-0.5 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-sm font-semibold text-white truncate">{icon.name}</span>
            <div className="flex flex-wrap gap-1">
              {icon.tags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { onTagClick?.(tag); onClose(); }}
                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-3 flex items-center gap-1.5 shrink-0">
            <a
              href={icon.link ?? "https://cssvg.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/50 hover:bg-blue-950 border border-blue-800/50 transition-colors"
            >
              Edit in cssvg
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body — side by side */}
        <div className="flex gap-0 sm:gap-0">

          {/* Left: big preview */}
          <div className="flex flex-col items-center justify-center gap-4 p-6 border-r border-zinc-800/60 shrink-0"
            style={{ minWidth: previewSize + 80, minHeight: previewSize + 80 }}
          >
            <div
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center"
              style={{ width: previewSize + 48, height: previewSize + 48 }}
            >
              <IconRenderer
                slug={icon.slug}
                color={color}
                strokeWidth={strokeWidth}
                size={previewSize}
                absoluteStroke={absoluteStroke}
                animated={animated}
                speed={speed}
                hoverToAnimate={hoverToAnimate}
              />
            </div>

            {/* Play/Pause + Hover + Speed */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setAnimated((v) => !v); setHoverToAnimate(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              >
                {animated && !hoverToAnimate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {animated && !hoverToAnimate ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => { setHoverToAnimate((v) => !v); setAnimated(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  hoverToAnimate
                    ? "bg-white text-black"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                <MousePointer className="w-3 h-3" />
                Hover
              </button>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                      speed === s ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col justify-center gap-3 p-6 flex-1 min-w-0">

            {icon.description && (
              <p className="text-xs text-zinc-500 leading-relaxed">{icon.description}</p>
            )}

            <button
              onClick={copyJsx}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-9 text-xs rounded-lg transition-colors"
            >
              Copy JSX
            </button>

            <button
              onClick={downloadSvg}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download SVG
            </button>

            <Link
              href={`/icons/${icon.slug}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Customize <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {icon.credit && (
              <p className="text-[10px] text-zinc-600 text-center pt-1">by {icon.credit}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
