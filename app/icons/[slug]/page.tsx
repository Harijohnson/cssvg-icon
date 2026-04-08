import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIconRegistry, getIconBySlug } from "@/lib/icons-registry";
import IconRenderer from "@/components/icon-renderer";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all icons in the registry.
 */
export async function generateStaticParams() {
  const registry = await getIconRegistry();
  return registry.map((icon) => ({
    slug: icon.slug,
  }));
}

/**
 * Generate metadata for the specific icon.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const icon = await getIconBySlug(slug);

  if (!icon) {
    return {
      title: "Icon Not Found",
    };
  }

  const title = `Animated ${icon.name} Icon | CSSVG`;
  const description = icon.description || `High-quality animated ${icon.name.toLowerCase()} icon for web development.`;

  return {
    title,
    description,
    keywords: [...icon.tags, "svg", "animated", "icon", "cssvg"],
    alternates: {
      canonical: `/icons/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function IconDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const icon = await getIconBySlug(slug);

  if (!icon) {
    notFound();
  }

  // Generate structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": icon.name,
    "description": icon.description,
    "contentUrl": `/icons/${slug}.svg`,
    "fileFormat": "image/svg+xml",
    "keywords": icon.tags.join(", "),
  };

  const reactExample = `import ${icon.name}Icon from "@/icons/${icon.slug}/${icon.slug}";

export default function MyComponent() {
  return (
    <${icon.name}Icon className="w-6 h-6" />
  );
}`;

  const reactUsage = `<${icon.name}Icon />`;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to gallery
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Large Preview */}
          <div className="relative aspect-square bg-zinc-950 border border-zinc-900 rounded-3xl flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />
            <IconRenderer 
              slug={icon.slug} 
              className="w-40 h-40 text-white lg:w-64 lg:h-64 transition-transform duration-500 group-hover:scale-110" 
            />
          </div>

          {/* Right: Details & Actions */}
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {icon.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter">
                {icon.name}
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-lg">
                {icon.description || "A clean, animated SVG icon design optimized for modern React applications."}
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-4">
              <CopyButton 
                content={reactUsage} 
                label="Copy React Component"
                className="h-12 bg-white text-black hover:bg-zinc-200 border-none font-bold"
                toastMessage="Component usage copied"
              />
              <Button asChild variant="outline" className="h-12 border-zinc-800 hover:bg-zinc-900 hover:text-white">
                <a href={`data:image/svg+xml;base64,${Buffer.from(icon.svgPath).toString('base64')}`} download={`${icon.slug}.svg`}>
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </a>
              </Button>
            </div>

            <div className="space-y-4 pt-10 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">React Usage</h3>
                <CopyButton 
                  content={reactExample} 
                  label="Copy Full Code" 
                  variant="ghost" 
                  size="xs" 
                  className="text-zinc-500 hover:text-white"
                  toastMessage="Full component code copied"
                />
              </div>
              <div className="relative group">
                <pre className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 font-mono text-sm text-zinc-400 overflow-x-auto">
                  {reactExample}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 mt-20 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-600 text-sm">
            Ready to use in your Next.js, Vite, or Remix projects. 
            Styled with Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
