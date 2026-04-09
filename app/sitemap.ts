import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

import { getIconRegistry } from "@/lib/icons-registry"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/docs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/license`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/support`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ]

  // Documentation pages
  const docsDir = path.join(process.cwd(), "content", "docs")
  let docPages: MetadataRoute.Sitemap = []
  try {
    const files = await fs.readdir(docsDir)
    docPages = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        url: `${siteUrl}/docs/${file.replace(".md", "")}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch {
    docPages = []
  }

  // Icon detail pages
  const iconRegistry = await getIconRegistry()
  const iconPages: MetadataRoute.Sitemap = iconRegistry.map((icon) => ({
    url: `${siteUrl}/icons/${icon.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...corePages, ...docPages, ...iconPages]
}
