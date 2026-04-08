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

  return {
    title: `${title} | cssvg-icon`,
    description: `Learn about ${title} in the cssvg-icon animated SVG system.`,
    alternates: {
      canonical: `/docs/${slug}`,
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

  return <MarkdownPage content={content} title={title} />;
}
