import React from "react";
import { getIconRegistry } from "@/lib/icons-registry";
import IconExplorer from "@/components/IconExplorer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "cssvg-icon | Animated SVG Icon System",
  description: "Browse and copy animated SVG icons for Next.js and Tailwind CSS. Free, open-source, and tree-shakeable.",
  keywords: ["animated svg icons", "react icons", "next.js icons", "tailwind icons", "svg icon library", "cssvg"],
  alternates: {
    canonical: "https://icon.cssvg.com",
  },
  openGraph: {
    type: "website",
    url: "https://icon.cssvg.com",
    title: "cssvg-icon | Animated SVG Icon System",
    description: "Browse and copy animated SVG icons for Next.js and Tailwind CSS. Free, open-source, and tree-shakeable.",
    siteName: "cssvg-icon",
  },
  twitter: {
    card: "summary_large_image",
    title: "cssvg-icon | Animated SVG Icon System",
    description: "Browse and copy animated SVG icons for Next.js and Tailwind CSS.",
    creator: "@cssvg_",
    site: "@cssvg_",
  },
};

export default async function HomePage() {
  const initialIcons = await getIconRegistry();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col">
      <Header />

      <main className="grow max-w-ful mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
        {/* Hero Section */}
        {/* <section className="text-center mb-24 space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000"> */}
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">
            <span className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            v1.0.0 Stable
          </div> */}

        {/* <h1 className="text-5xl lg:text-8xl font-bold tracking-tighter text-white leading-tight">
            Icons for <br />
            <span className="text-zinc-500">developers.</span>
          </h1> */}

        {/* <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            A professional, scalable, and SEO-ready animated SVG icon system for Next.js.
            Designed for those who value performance and rich aesthetics.
          </p> */}
        {/* 
          <div className="flex items-center justify-center gap-4 pt-4">
            <a href="#icons" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95">
              Explore Library
            </a>
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors text-sm font-semibold">
              Get Started →
            </Link>
          </div> */}
        {/* </section> */}

        {/* Icon Explorer Section */}
        <div id="icons" className="scroll-mt-10">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="w-8 h-1 bg-white rounded-full opacity-10" />
            <h2 className="text-2xl font-bold tracking-tight">Icon Library</h2>
            <div className="w-8 h-1 bg-white rounded-full opacity-10" />
          </div>
          <IconExplorer initialIcons={initialIcons} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
