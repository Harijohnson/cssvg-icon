import React from "react";
import { getIconRegistry } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Icon Registry Demo",
  description: "Browse and verify the automated icon registry.",
};

export default async function IconDemoPage() {
  const registry = await getIconRegistry();

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Icon Registry</h1>
        <p className="text-gray-500 text-lg">
          Scalable, automated icon loading system for Next.js.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registry.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No icons found in icons/</p>
            </div>
          ) : (
            registry.map((icon) => (
              <div
                key={icon.slug}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <IconRenderer slug={icon.slug} className="w-8 h-8" />
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{icon.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {icon.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <code className="text-[10px] text-gray-400 font-mono">
                    {icon.slug}
                  </code>
                  <Button variant="outline" size="sm" className="h-8">
                    Copy SVG
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <section className="max-w-6xl mx-auto mt-20 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">1. Folder Structure</h3>
            <p className="text-gray-500 text-sm">
              Each icon lives in its own folder under <code className="bg-gray-50 px-1 rounded">icons/</code>. 
              The system scans these folders automatically.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs text-gray-600">
              icons/<br />
              └── arrow/<br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── arrow.tsx<br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── arrow.json<br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── arrow.svg
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">2. Metadata & Raw SVG</h3>
            <p className="text-gray-500 text-sm">
              JSON metadata is parsed for search and categorization, while the SVG file is read as a raw string for compatibility with various tools.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs text-gray-600">
              {"{"}<br />
              &nbsp;&nbsp;"name": "Arrow",<br />
              &nbsp;&nbsp;"slug": "arrow",<br />
              &nbsp;&nbsp;"description": "Animated arrow icon",<br />
              &nbsp;&nbsp;"tags": ["arrow", "direction"]<br />
              {"}"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
