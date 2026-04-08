"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { X, Download } from "lucide-react";
import { toast } from "sonner";
import { IconRegistryEntry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";

interface IconDetailModalProps {
  icon: IconRegistryEntry | null;
  onClose: () => void;
  color: string;
  strokeWidth: number;
  size: number;
}

export default function IconDetailModal({ icon, onClose, color, strokeWidth, size }: IconDetailModalProps) {
  if (!icon) return null;
  return <ModalContent key={icon.slug} icon={icon} onClose={onClose} color={color} strokeWidth={strokeWidth} size={size} />;
}

function ModalContent({
  icon,
  onClose,
  color,
  strokeWidth,
  size,
}: {
  icon: IconRegistryEntry;
  onClose: () => void;
  color: string;
  strokeWidth: number;
  size: number;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

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

  const getModifiedSvg = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(icon.svgPath, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("stroke", color);
      svgEl.setAttribute("stroke-width", String(strokeWidth));
      svgEl.setAttribute("width", String(size));
      svgEl.setAttribute("height", String(size));
    }
    return svgEl ? svgEl.outerHTML : icon.svgPath;
  };

  const copySvg = () => {
    navigator.clipboard.writeText(getModifiedSvg());
    toast.success("SVG copied");
  };

  const copyJsx = () => {
    navigator.clipboard.writeText(
      `<${icon.name}Icon color="${color}" strokeWidth={${strokeWidth}} style={{ width: ${size}, height: ${size} }} />`
    );
    toast.success("JSX copied");
  };

  const downloadSvg = () => {
    const blob = new Blob([getModifiedSvg()], { type: "image/svg+xml" });
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
      <div className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-xl animate-in slide-in-from-bottom duration-250 max-h-[70vh] min-h-[40vh] overflow-y-auto">

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
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 ">

          {/* Preview */}
          <div className="flex items-center justify-center p-6  shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <div
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center"
              style={{ width: size + 48, height: size + 48 }}
            >
              <IconRenderer
                slug={icon.slug}
                color={color}
                strokeWidth={strokeWidth}
                size={size}
              />
            </div>
          </div>

          {/* Metadata + Actions */}
          <div className="flex-1 px-5 py-4 flex flex-col gap-4">
            {(icon.credit || icon.reference || icon.link) && (
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 block">Icon Details</span>
                <div className="grid grid-cols-1 gap-2">
                  {icon.credit && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Author</span>
                      <span className="text-zinc-300 font-medium">{icon.credit}</span>
                    </div>
                  )}
                  {icon.reference && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Reference</span>
                      <a href={icon.reference} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors">
                        Source Registry
                      </a>
                    </div>
                  )}
                  {icon.link && (
                    <div className="pt-2">
                      <a
                        href={icon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all transform hover:-translate-y-0.5"
                      >
                        Open Original Site
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 mt-auto">
              <Button
                onClick={copySvg}
                variant="outline"
                size="sm"
                className="flex-1 border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300 h-8 text-xs font-semibold"
              >
                Copy SVG
              </Button>
              <Button
                onClick={copyJsx}
                size="sm"
                className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold h-8 text-xs"
              >
                Copy JSX
              </Button>
              <Button
                onClick={downloadSvg}
                variant="ghost"
                size="sm"
                className="text-zinc-500 hover:text-white hover:bg-zinc-800 h-8 px-2"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
