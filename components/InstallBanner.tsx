"use client";

import { useState } from "react";

const TABS = [
  { label: "npm", command: "npm i cssvg-icons" },
  { label: "pnpm", command: "pnpm add cssvg-icons" },
  { label: "yarn", command: "yarn add cssvg-icons" },
  { label: "bun", command: "bun add cssvg-icons" },
];

export default function InstallBanner() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(TABS[active].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col items-center mb-12">
      {/* Tab row */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 mb-4 rounded-xl p-1 ">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              active === i
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Command row */}
      <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-3 w-full max-w-sm">
        <span className="font-mono text-sm text-zinc-300 flex-1 select-all">
          {TABS[active].command}
        </span>
        <button
          onClick={copy}
          aria-label="Copy install command"
          className="text-zinc-500 hover:text-white transition-colors shrink-0"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
