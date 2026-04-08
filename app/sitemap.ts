import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

import { getIconRegistry } from "@/lib/icons-registry"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cssvg.com").replace(/\/$/, "")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePages = ["", "/docs", "/license", "/privacy", "/support"]

  // Collect documentation pages from Markdown files.
  const docsDir = path.join(process.cwd(), "content", "docs")
  let docPages: string[] = []
  try {
    const files = await fs.readdir(docsDir)
    docPages = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => `/docs/${file.replace(".md", "")}`)
  } catch {
    docPages = []
  }

  // Collect dynamic icon detail pages.
  const iconRegistry = await getIconRegistry()
  const iconPages = iconRegistry.map((icon) => `/icons/${icon.slug}`)

  const lastModified = new Date()

  return [...basePages, ...docPages, ...iconPages].map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified,
  }))
}
