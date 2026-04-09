import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { MarkdownPage } from "@/components/MarkdownPage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const docsDir = path.join(process.cwd(), "content", "docs");
  try {
    const files = await fs.readdir(docsDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        slug: file.replace(".md", ""),
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "");
  const pageUrl = `${siteUrl}/docs/${slug}`;
  const description = `Learn about ${title} in the cssvg-icon animated SVG icon system for Next.js and Tailwind CSS.`;

  return {
    title: `${title} | cssvg-icon Docs`,
    description,
    keywords: ["cssvg-icon", "animated svg", "icon docs", title.toLowerCase(), "next.js", "tailwind"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: `${title} | cssvg-icon Docs`,
      description,
      siteName: "cssvg-icon",
    },
    twitter: {
      card: "summary",
      title: `${title} | cssvg-icon Docs`,
      description,
      creator: "@cssvg_",
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "docs", `${slug}.md`);
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
    return null;
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Docs", "item": `${siteUrl}/docs` },
      { "@type": "ListItem", "position": 3, "name": title, "item": `${siteUrl}/docs/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MarkdownPage content={content} title={title} />
    </>
  );
}
