import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getIconRegistry } from "@/lib/icons-registry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import IconExplorer from "@/components/IconExplorer";
import { SITE_URL, BASE_OG_IMAGE } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Free Animated SVG Icon Library — React & Next.js | cssvg-icon",
  description:
    "Browse and download free animated SVG icons for React, Next.js, and Tailwind CSS. Copy React component code, download SVG, or install via npm. MIT licensed.",
  keywords: [
    "free svg icon library",
    "animated svg icons",
    "react icon library",
    "next.js icon library",
    "svg icons download",
    "tailwind css icons",
    "open source icon set",
    "ui icon library",
    "web icons",
    "icon npm package",
    "cssvg icons",
    "lucide alternative",
    "heroicons alternative",
  ],
  alternates: { canonical: `${SITE_URL}/icons` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/icons`,
    locale: "en_US",
    title: "Free Animated SVG Icon Library — React & Next.js | cssvg-icon",
    description:
      "Browse and download free animated SVG icons for React, Next.js, and Tailwind CSS. MIT licensed, open source.",
    siteName: "cssvg-icon",
    images: BASE_OG_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Animated SVG Icon Library — React & Next.js | cssvg-icon",
    description:
      "Browse and download free animated SVG icons for React, Next.js, and Tailwind CSS. MIT licensed, open source.",
    creator: "@cssvg_",
    site: "@cssvg_",
    images: ["/og-image.png"],
  },
};

export default async function IconsPage() {
  const icons = await getIconRegistry();
  const iconCount = icons.length;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Icons", item: `${SITE_URL}/icons` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "cssvg-icon — Animated SVG Icon Library",
    description: `${iconCount} free animated SVG icons for React and Next.js`,
    url: `${SITE_URL}/icons`,
    numberOfItems: iconCount,
    itemListElement: icons.map((icon, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${icon.name} Animated SVG Icon`,
      url: `${SITE_URL}/icons/${icon.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Header />

      <main className="grow w-full">

        {/* ── Page header ── */}
        <section className="border-b border-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 text-center">
            <nav className="text-xs text-zinc-600 mb-6 flex items-center justify-center gap-2">
              <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-400">Icons</span>
            </nav>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Animated SVG Icon Library
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
              {iconCount} free, open source animated SVG icons for React, Next.js, and Tailwind CSS.
              Customise colour, size, and stroke width — then copy the component or download the SVG.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors"
              >
                Get Started
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/docs/usage"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-zinc-500 hover:text-white transition-colors"
              >
                View usage docs
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Explorer ── */}
        <section aria-label="Icon search and grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <IconExplorer initialIcons={icons} />
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="border-t border-zinc-900">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Missing an icon?
            </h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              Request a new icon or contribute one yourself using the CSSVG Editor.
              All icons are MIT licensed and free to use in any project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/requests"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors"
              >
                Request an Icon
              </Link>
              <Link
                href="https://github.com/Harijohnson/cssvg-icon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-zinc-500 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                Contribute on GitHub
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
