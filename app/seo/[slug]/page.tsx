import { notFound } from "next/navigation";
import { getSeoPostBySlug } from "@/lib/seo-posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import React from "react";

export const dynamic = "force-dynamic";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "");

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getSeoPostBySlug(slug);
  if (!post) return {};

  const pageUrl = `${siteUrl}/seo/${slug}`;
  return {
    title: `${post.title} | cssvg-icons Blog`,
    description: post.excerpt,
    keywords: [...post.tags, "cssvg-icons", "svg icons", "animated icons", "smil"],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: post.title,
      description: post.excerpt,
      siteName: "cssvg-icon",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@cssvg_",
    },
  };
}

export default async function SeoBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getSeoPostBySlug(slug);
  if (!post) notFound();

  const pageUrl = `${siteUrl}/seo/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    url: pageUrl,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: "cssvg-icon", url: siteUrl },
    author: { "@type": "Person", name: "Hari" },
    publisher: { "@type": "Organization", name: "cssvg-icon", url: siteUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/seo` },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  const mdComponents = {
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return <h3 id={id} {...props}>{children}</h3>;
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <main className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          {/* Back link */}
          <Link
            href="/seo"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-12 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All posts
          </Link>

          {/* Header */}
          <header className="mb-12">
            {post.series && (
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                {post.series}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white leading-tight mb-6">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Body */}
          <article className="prose prose-invert prose-zinc max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tighter prose-headings:font-bold prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-2 prose-a:text-white prose-a:underline-offset-4 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-900 prose-code:text-zinc-300 prose-code:bg-zinc-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-zinc-800 prose-blockquote:text-zinc-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-zinc-900">
            <Link
              href="/seo"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
