"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function IconRequestForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");

  function buildUrl() {
    const title = `Icon request: ${name.trim()}`;
    const body = [
      `## Icon name\n${name.trim()}`,
      `## Description\n${description.trim() || "_No description provided._"}`,
      `## Reference\n${reference.trim() || "_No reference provided._"}`,
      `## Additional context\n_Submitted via icon.cssvg.com/requests_`,
    ].join("\n\n");

    return (
      "https://github.com/Harijohnson/cssvg-icon/issues/new?" +
      new URLSearchParams({ title, body, labels: "icon-request" }).toString()
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    window.open(buildUrl(), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-5 max-w-2xl mx-auto w-full"
    >
      <div className="space-y-1">
        <h2 className="text-base font-bold tracking-tight text-white">Request an icon</h2>
        <p className="text-xs text-zinc-500">Fills a GitHub issue automatically — you just hit Submit.</p>
      </div>

      {/* Icon name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 block">
          Icon name <span className="text-blue-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Heart Filled, Loader Spin, Camera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 block">
          Description
          <span className="text-zinc-600 font-normal ml-1">— what does it represent?</span>
        </label>
        <textarea
          rows={3}
          placeholder="e.g. A filled heart icon for like/favourite actions, with a pulse animation on hover."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors resize-none"
        />
      </div>

      {/* Reference */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 block">
          Reference link
          <span className="text-zinc-600 font-normal ml-1">— Lucide, Heroicons, Phosphor, etc.</span>
        </label>
        <input
          type="url"
          placeholder="https://lucide.dev/icons/heart"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Open request on GitHub
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>

      <p className="text-[10px] text-zinc-600 text-center">
        Opens a pre-filled GitHub issue. You&apos;ll need a GitHub account to submit.
      </p>
    </form>
  );
}
