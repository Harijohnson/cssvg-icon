import React from "react";
import Link from "next/link";
import { getIconRegistry } from "@/lib/icons-registry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import InstallBanner from "@/components/InstallBanner";
import { SITE_URL, BASE_TITLE, BASE_DESCRIPTION, BASE_KEYWORDS, BASE_OG_IMAGE } from "@/lib/metadata";

export const metadata = {
  title: BASE_TITLE,
  description: BASE_DESCRIPTION,
  keywords: BASE_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "en_US",
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    siteName: "cssvg-icon",
    images: BASE_OG_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    creator: "@cssvg_",
    site: "@cssvg_",
    images: ["/og-image.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "cssvg-icon",
  url: SITE_URL,
  description: BASE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const initialIcons = await getIconRegistry();
  const iconCount = initialIcons.length;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "cssvg-icons",
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: `${iconCount} free animated SVG icons for React and Next.js. Tree-shakeable npm package with SMIL animation. MIT licensed, open source.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    downloadUrl: "https://www.npmjs.com/package/cssvg-icons",
    codeRepository: "https://github.com/Harijohnson/cssvg-icon",
    license: `${SITE_URL}/license`,
    author: {
      "@type": "Person",
      name: "Hari",
    },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Header />

      <main className="grow w-full">

        {/* ── Hero ── */}
        <section className="border-b border-zinc-900 py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-5">
              Animated SVG Icons<br />
              <span className="text-zinc-500">for React & Next.js</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
              {iconCount} free open source animated icons. Tree-shakeable, zero dependencies,
              MIT licensed. Copy the component or install via npm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link href="/icons" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                Browse {iconCount} Icons
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/docs/getting-started" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors font-medium">
                Get Started
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <InstallBanner />
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-b border-zinc-900 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-6">
            <dl className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { value: `${iconCount}+`, label: "Free Icons" },
                { value: "MIT", label: "License" },
                { value: "0", label: "Dependencies" },
                { value: "SMIL", label: "Animation" },
              ].map(({ value, label }, i) => (
                <div key={label} className={`py-8 text-center ${i < 3 ? "sm:border-r border-zinc-800" : ""}`}>
                  <dt className="text-3xl font-bold text-white">{value}</dt>
                  <dd className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-zinc-900 py-20" aria-labelledby="how-heading">
          <div className="max-w-4xl mx-auto px-6">
            <h2 id="how-heading" className="text-2xl font-bold text-white mb-12 text-center">
              Up and running in three steps
            </h2>
            <ol className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Install",
                  body: "Add cssvg-icons to any React or Next.js project. Works with npm, pnpm, yarn, and bun. No peer dependencies.",
                  code: "npm i cssvg-icons",
                },
                {
                  step: "2",
                  title: "Import",
                  body: "Import icons by name. Only the icons you import are bundled — everything else is tree-shaken out at build time.",
                  code: `import { Bell } from "cssvg-icons"`,
                },
                {
                  step: "3",
                  title: "Use",
                  body: "Drop into JSX. Pass color, size, and strokeWidth. SMIL animation plays automatically — no setup needed.",
                  code: `<Bell size={32} color="currentColor" />`,
                },
              ].map(({ step, title, body, code }) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_1fr_auto] gap-x-5 gap-y-3 items-start">
                  <span className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0">
                    {step}
                  </span>
                  <div>
                    <p className="font-semibold text-white mb-1">{title}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
                  </div>
                  <div className="col-start-2 sm:col-start-3 sm:row-start-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 font-mono text-xs text-zinc-400 self-center whitespace-nowrap">
                    {code}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-b border-zinc-900 py-20 bg-zinc-950" aria-labelledby="features-heading">
          <div className="max-w-4xl mx-auto px-6">
            <h2 id="features-heading" className="text-2xl font-bold text-white mb-2 text-center">
              Everything you need
            </h2>
            <p className="text-zinc-500 text-sm text-center mb-12">
              Each icon is a self-contained React component with animation built in.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Animated out of the box",
                  body: "Every icon uses native SVG SMIL animation. No JS animation libraries, no CSS keyframes. Smooth on first render, no setup.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
                },
                {
                  title: "Copy & paste ready",
                  body: "Click any icon to get the full TSX source. Paste into your project — no install, no imports to wire up.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
                },
                {
                  title: "Tree-shakeable",
                  body: "Import only what you use. Unused icons are eliminated at build time by Webpack, Vite, Turbopack, or esbuild.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
                },
                {
                  title: "Customisable props",
                  body: "Every icon takes color, size, and strokeWidth. Preview live in the explorer, then copy the exact variant you need.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
                },
                {
                  title: "Works with Tailwind CSS",
                  body: "Icons use currentColor by default — they inherit any Tailwind text colour class. No extra config required.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
                },
                {
                  title: "MIT licensed",
                  body: "Free for personal and commercial projects. Fork, modify, or contribute new icons via the CSSVG Editor.",
                  icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                },
              ].map(({ title, body, icon }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Compatibility ── */}
        <section className="border-b border-zinc-900 py-20" aria-labelledby="compat-heading">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              <div>
                <h2 id="compat-heading" className="text-2xl font-bold text-white mb-4">
                  Works wherever React runs
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Ships as ESM with TypeScript types. No special setup needed — works in Next.js, Vite, Remix, and Gatsby out of the box.
                </p>
                <ul className="space-y-2">
                  {[
                    ["Next.js 13+", "App Router & Pages Router"],
                    ["React 18+", "Client & server components"],
                    ["Vite + React", "Zero config, instant HMR"],
                    ["Remix", "Loaders, actions, components"],
                    ["TypeScript", "Types included"],
                    ["Tailwind CSS", "currentColor compatible"],
                  ].map(([fw, desc]) => (
                    <li key={fw} className="flex items-center gap-3 text-sm py-2 border-b border-zinc-900 last:border-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-none stroke-zinc-600 stroke-2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span className="text-white font-medium w-28 shrink-0">{fw}</span>
                      <span className="text-zinc-500">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white mb-4">Quick start</h3>
                {[
                  { label: "Install", code: "npm i cssvg-icons" },
                  { label: "Import", code: `import { Bell, ArrowRight } from "cssvg-icons"` },
                  { label: "Use", code: `<Bell size={24} color="currentColor" strokeWidth={2} />` },
                ].map(({ label, code }) => (
                  <div key={label} className="bg-zinc-950 border border-zinc-800/60 rounded-lg p-4">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">{label}</p>
                    <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap">{code}</pre>
                  </div>
                ))}
                <p className="text-xs text-zinc-600 pt-1">
                  Or skip npm entirely — click any icon in the library and copy the TSX component.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-b border-zinc-900 py-20 bg-zinc-950" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-6">
            <h2 id="faq-heading" className="text-2xl font-bold text-white mb-10 text-center">
              Common questions
            </h2>
            <div className="space-y-0 divide-y divide-zinc-900">
              {[
                {
                  q: "Are the icons really free?",
                  a: "Yes — every icon is MIT licensed. Free for personal and commercial use, no attribution required, no paid tiers.",
                },
                {
                  q: "What animation technology is used?",
                  a: "SVG SMIL — a native browser standard. No CSS keyframes, no JavaScript animation runtime, no dependencies.",
                },
                {
                  q: "Can I use icons without installing npm?",
                  a: "Yes. Click any icon, copy the TSX source, paste into your project. npm is only needed for version-locked installs.",
                },
                {
                  q: "Do icons work with Next.js server components?",
                  a: "Icons use 'use client' because SMIL runs in the browser. Import them inside any client component boundary in the App Router.",
                },
                {
                  q: "How do I contribute a new icon?",
                  a: "Design in the CSSVG Editor, export the TSX component, open a pull request on GitHub. See CONTRIBUTING.md for the full spec.",
                },
                {
                  q: "How do I request an icon?",
                  a: "Visit the Requests page, describe what you need. Community-voted requests are prioritised each release.",
                },
              ].map(({ q, a }) => (
                <details key={q} className="group py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 text-sm font-semibold text-white select-none">
                    {q}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-zinc-600 fill-none stroke-current stroke-2 transition-transform group-open:rotate-180" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </summary>
                  <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 id="cta-heading" className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5">
              Start for free, today
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
              {iconCount} animated SVG icons, ready to drop into your React or Next.js project.
              Open source, MIT licensed, no sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/icons" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                Browse Icon Library
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/docs/getting-started" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors font-medium">
                Read the Docs →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
