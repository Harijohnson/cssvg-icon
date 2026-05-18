import fs from "fs/promises";
import path from "path";

export interface SeoPost {
  slug: string;
  title: string;
  tags: string[];
  series: string;
  excerpt: string;
  filename: string;
}

export interface SeoPostFull extends SeoPost {
  content: string;
}

const SEO_DIR = path.join(process.cwd(), "seo");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1");
    meta[key] = value;
  }

  return { meta, body: match[2].trim() };
}

function fileSlug(filename: string): string {
  // "0001-some-title.md" → "0001-some-title"
  return filename.replace(/\.md$/, "");
}

function excerptFrom(body: string, maxChars = 160): string {
  // First non-empty paragraph that isn't a heading
  const lines = body.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  const text = lines[0] ?? "";
  return text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "…" : text;
}

export async function getAllSeoPosts(): Promise<SeoPost[]> {
  let files: string[];
  try {
    files = await fs.readdir(SEO_DIR);
  } catch {
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md") && f !== ".gitkeep").sort().reverse();

  const posts = await Promise.all(
    mdFiles.map(async (filename) => {
      const raw = await fs.readFile(path.join(SEO_DIR, filename), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      return {
        slug: fileSlug(filename),
        title: meta.title ?? fileSlug(filename),
        tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()) : [],
        series: meta.series ?? "",
        excerpt: excerptFrom(body),
        filename,
      } satisfies SeoPost;
    })
  );

  return posts;
}

export async function getSeoPostBySlug(slug: string): Promise<SeoPostFull | null> {
  const filename = `${slug}.md`;
  const filepath = path.join(SEO_DIR, filename);
  let raw: string;
  try {
    raw = await fs.readFile(filepath, "utf-8");
  } catch {
    return null;
  }

  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title ?? slug,
    tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()) : [],
    series: meta.series ?? "",
    excerpt: excerptFrom(body),
    content: body,
    filename,
  };
}
