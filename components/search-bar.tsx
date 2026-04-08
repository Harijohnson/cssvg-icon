"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search animated icons...",
  className,
}: SearchBarProps) {
  return (
    <div className={`relative w-full group ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="pl-10 h-12 bg-black border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 transition-all rounded-md"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
        >
          Clear
        </button>
      )}
    </div>
  );
}
