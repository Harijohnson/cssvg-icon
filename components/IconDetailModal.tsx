"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { X, ArrowUpRight, Download, Repeat } from "lucide-react";
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

export default function IconDetailModal({ icon, onClose, color, strokeWidth, size, absoluteStroke, onTagClick }: IconDetailModalProps) {
  if (!icon) return null;
  return <ModalContent key={icon.slug} icon={icon} onClose={onClose} color={color} strokeWidth={strokeWidth} size={size} absoluteStroke={absoluteStroke} onTagClick={onTagClick} />;
}

function ModalContent({ icon, onClose, color, strokeWidth, size, absoluteStroke, onTagClick }: {
  icon: IconRegistryEntry;
  onClose: () => void;
  color: string;
  strokeWidth: number;
  size: number;
  absoluteStroke?: boolean;
  onTagClick?: (tag: string) => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [loopOn, setLoopOn] = useState(true);

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

  useEffect(() => {
    const svg = previewRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    svg.querySelectorAll("animateTransform, animate, animateMotion").forEach((el) => {
      el.setAttribute("repeatCount", loopOn ? "indefinite" : "1");
      if (!loopOn) (el as SVGAnimationElement).beginElement?.();
    });
  }, [loopOn]);

  const copyJsx = () => {
    navigator.clipboard.writeText(
      `<${icon.name}Icon color="${color}" strokeWidth={${strokeWidth}} size={${size}} />`
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

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-xl animate-in slide-in-from-bottom duration-200">

        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-0.5 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">{icon.name}</span>
            <div className="flex flex-wrap gap-1">
              {icon.tags.map((tag) => (
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
          <button onClick={onClose} className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex items-center gap-6 px-6 py-5">
          {/* Preview */}
          <div
            ref={previewRef}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center shrink-0"
            style={{ width: size + 32, height: size + 32 }}
          >
            <IconRenderer slug={icon.slug} color={color} strokeWidth={strokeWidth} size={size} absoluteStroke={absoluteStroke} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <button
              onClick={copyJsx}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-9 text-xs rounded-md transition-colors"
            >
              Copy JSX
            </button>
            <div className="flex gap-2">
              <button
                onClick={downloadSvg}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> SVG
              </button>
              <button
                type="button"
                onClick={() => setLoopOn((v) => !v)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-md transition-colors ${
                  loopOn ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" /> Loop
              </button>
            </div>
            <Link
              href={`/icons/${icon.slug}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold h-9 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            >
              Customize <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
