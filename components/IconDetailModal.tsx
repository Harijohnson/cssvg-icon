"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { X, Download, Pause, Play, Repeat } from "lucide-react";
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
  animPaused: boolean;
  setAnimPaused: (v: boolean) => void;
  animSpeed: number;
  setAnimSpeed: (v: number) => void;
}

export default function IconDetailModal({ icon, onClose, color, strokeWidth, size, animPaused, setAnimPaused, animSpeed, setAnimSpeed }: IconDetailModalProps) {
  if (!icon) return null;
  return <ModalContent key={icon.slug} icon={icon} onClose={onClose} color={color} strokeWidth={strokeWidth} size={size} animPaused={animPaused} setAnimPaused={setAnimPaused} animSpeed={animSpeed} setAnimSpeed={setAnimSpeed} />;
}

const SPEED_STEPS = [0.25, 0.5, 1, 1.5, 2, 3];

function ModalContent({
  icon,
  onClose,
  color,
  strokeWidth,
  size,
  animPaused,
  setAnimPaused,
  animSpeed,
  setAnimSpeed,
}: {
  icon: IconRegistryEntry;
  onClose: () => void;
  color: string;
  strokeWidth: number;
  size: number;
  animPaused: boolean;
  setAnimPaused: (v: boolean) => void;
  animSpeed: number;
  setAnimSpeed: (v: number) => void;
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

  // Apply pause/unpause to SMIL animations
  useEffect(() => {
    const svg = previewRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    if (animPaused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [animPaused]);

  // Apply loop on/off
  useEffect(() => {
    const svg = previewRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    const animEls = svg.querySelectorAll("animateTransform, animate, animateMotion");
    animEls.forEach((el) => {
      el.setAttribute("repeatCount", loopOn ? "indefinite" : "1");
    });
    // Restart by re-triggering via beginElement if available
    if (!loopOn) {
      animEls.forEach((el) => {
        (el as SVGAnimationElement).beginElement?.();
      });
    }
  }, [loopOn]);

  // Apply speed by scaling all dur attributes
  useEffect(() => {
    const svg = previewRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;
    const animEls = svg.querySelectorAll("animateTransform, animate, animateMotion");
    animEls.forEach((el) => {
      const baseDur = el.getAttribute("data-base-dur") ?? el.getAttribute("dur");
      if (!baseDur) return;
      if (!el.getAttribute("data-base-dur")) el.setAttribute("data-base-dur", baseDur);
      const baseSeconds = parseFloat(baseDur);
      if (!isNaN(baseSeconds)) {
        el.setAttribute("dur", `${(baseSeconds / animSpeed).toFixed(3)}s`);
      }
    });
  }, [animSpeed]);

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
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Preview */}
          <div className="flex items-center justify-center p-6 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/60">
            <div
              ref={previewRef}
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
                </div>
              </div>
            )}

            {/* Animation Controls */}
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Animation</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLoopOn(!loopOn)}
                    className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                      loopOn
                        ? "bg-white text-black font-semibold"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    <Repeat className="w-3 h-3" /> Loop
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnimPaused(!animPaused)}
                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    {animPaused
                      ? <><Play className="w-3 h-3" /> Play</>
                      : <><Pause className="w-3 h-3" /> Pause</>
                    }
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 block">Speed</span>
                <div className="flex gap-1">
                  {SPEED_STEPS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAnimSpeed(s)}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors font-mono ${
                        animSpeed === s
                          ? "bg-white text-black font-bold"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 mt-auto">
              <div className="flex items-center gap-2">
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
              </div>
              <Button
                onClick={downloadSvg}
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-300 h-8 text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download SVG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
