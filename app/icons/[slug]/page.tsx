import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIconRegistry, getIconBySlug } from "@/lib/icons-registry";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import IconUsagePage from "@/components/IconUsagePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const registry = await getIconRegistry();
  return registry.map((icon) => ({ slug: icon.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const icon = await getIconBySlug(slug);

  if (!icon) return { title: "Icon Not Found" };

  const title = `${icon.name} Animated SVG Icon — React, Vue, Svelte | CSSVG`;
  const description = `Use the animated ${icon.name.toLowerCase()} SVG icon in React, Vue, or Svelte. Customizable color, size, and stroke width. Free to use.`;

  return {
    title,
    description,
    keywords: [...icon.tags, "svg", "animated", "icon", "react", "vue", "svelte", "cssvg"],
    alternates: { canonical: `https://icon.cssvg.com/icons/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://icon.cssvg.com/icons/${slug}`,
      siteName: "cssvg-icon",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@cssvg_",
    },
  };
}

export default async function IconDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const icon = await getIconBySlug(slug);

  if (!icon) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: icon.name,
    description: icon.description,
    contentUrl: `https://icon.cssvg.com/icons/${slug}.svg`,
    fileFormat: "image/svg+xml",
    keywords: icon.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <nav className="border-b border-zinc-900 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to gallery
          </Link>
        </div>
      </nav>
      <IconUsagePage icon={icon} />
      <Footer />
    </div>
  );
}
