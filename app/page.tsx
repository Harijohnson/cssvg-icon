import React from "react";
import { getIconRegistry } from "@/lib/icons-registry";
import IconExplorer from "@/components/IconExplorer";

export const metadata = {
  title: "cssvg-icon | Minimalist Icon System",
  description: "A clean, developer-first icon registry for Next.js and Tailwind CSS.",
};

export default async function HomePage() {
  const initialIcons = await getIconRegistry();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">I</span>
            </div>
            <span className="font-semibold tracking-tight text-lg">cssvg-icon</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Icons</a>
            <a href="#" className="hover:text-white transition-colors">Hooks</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a 
              href="https://github.com" 
              target="_blank" 
              className="bg-zinc-900 px-3 py-1.5 rounded-md text-white hover:bg-zinc-800 transition-all border border-zinc-800"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <section className="text-center mb-20 space-y-6">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white">
            Icons for developers.
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
            Clean, minimalist, and fully automated SVG icon registry built for 
            modern web applications.
          </p>
        </section>

        {/* Icon Explorer Section */}
        <IconExplorer initialIcons={initialIcons} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-sm">
          <p>© 2026 cssvg-icon. Built with Next.js & Tailwind.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">License</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
