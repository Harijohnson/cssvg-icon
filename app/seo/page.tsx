import Link from "next/link";
import { getAllSeoPosts } from "@/lib/seo-posts";

export const dynamic = "force-dynamic";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "");

export const metadata = {
  title: "Blog | Animated SVG Icons with CSS",
  description:
    "Technical articles on animated SVG icons, SMIL animations, React icon libraries, and Next.js performance — from the cssvg-icons team.",
  keywords: ["svg icons", "smil animation", "react icons", "animated icons", "next.js", "css animation", "cssvg"],
  alternates: { canonical: `${siteUrl}/seo` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/seo`,
    title: "Blog | Animated SVG Icons with CSS",
    description:
      "Technical articles on animated SVG icons, SMIL animations, React icon libraries, and Next.js performance.",
    siteName: "cssvg-icon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Animated SVG Icons with CSS",
    description:
      "Technical articles on animated SVG icons, SMIL animations, React icon libraries, and Next.js performance.",
    creator: "@cssvg_",
  },
};

export default async function SeoBlogIndexPage() {
  const posts = await getAllSeoPosts();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
            Animated SVG Icons with CSS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            Blog
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
            Deep dives on SMIL animations, React icon libraries, Next.js performance, and everything
            behind{" "}
            <Link href="/" className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">
              cssvg-icons
            </Link>
            .
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-zinc-600 text-sm">No posts yet — check back soon.</p>
        ) : (
          <ul className="space-y-px">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/seo/${post.slug}`}
                  className="group flex flex-col gap-2 py-7 border-b border-zinc-900 hover:border-zinc-700 transition-colors"
                >
                  <h2 className="text-lg font-semibold tracking-tight text-white group-hover:text-zinc-200 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
