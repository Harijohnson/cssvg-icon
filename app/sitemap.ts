import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

import { getIconRegistry } from "@/lib/icons-registry"
import { getAllSeoPosts } from "@/lib/seo-posts"

export const dynamic = "force-dynamic"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "")

async function fileMtime(filePath: string): Promise<Date> {
  try {
    const stat = await fs.stat(filePath)
    return stat.mtime
  } catch {
    return new Date()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Core pages — use mtime of their source files where possible
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "page.tsx")),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/icons`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "icons", "page.tsx")),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: await fileMtime(path.join(process.cwd(), "content", "docs")),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/license`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "license", "page.tsx")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "privacy", "page.tsx")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/support`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "support", "page.tsx")),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/requests`,
      lastModified: await fileMtime(path.join(process.cwd(), "app", "requests", "page.tsx")),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Documentation pages — lastModified from the .md file mtime
  const docsDir = path.join(process.cwd(), "content", "docs")
  let docPages: MetadataRoute.Sitemap = []
  try {
    const files = await fs.readdir(docsDir)
    docPages = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => ({
          url: `${siteUrl}/docs/${file.replace(".md", "")}`,
          lastModified: await fileMtime(path.join(docsDir, file)),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
    )
  } catch {
    docPages = []
  }

  // Icon detail pages — lastModified from the icon's JSON file mtime
  const iconRegistry = await getIconRegistry()
  const iconsDir = path.join(process.cwd(), "icons")
  const iconPages: MetadataRoute.Sitemap = await Promise.all(
    iconRegistry.map(async (icon) => ({
      url: `${siteUrl}/icons/${icon.slug}`,
      lastModified: await fileMtime(path.join(iconsDir, icon.slug, `${icon.slug}.json`)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  )

  // SEO blog listing page
  const seoBlogPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/seo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Individual SEO blog post pages
  const seoPosts = await getAllSeoPosts()
  const seoDir = path.join(process.cwd(), "seo")
  const seoPostPages: MetadataRoute.Sitemap = await Promise.all(
    seoPosts.map(async (post) => ({
      url: `${siteUrl}/seo/${post.slug}`,
      lastModified: await fileMtime(path.join(seoDir, post.filename)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  )

  return [...corePages, ...docPages, ...iconPages, ...seoBlogPage, ...seoPostPages]
}
