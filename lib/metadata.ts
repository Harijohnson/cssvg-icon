const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://icon.cssvg.com").replace(/\/$/, "")

export const SITE_URL = siteUrl

export const BASE_TITLE = "Free Animated SVG Icons for React & Next.js | cssvg-icon"

export const BASE_DESCRIPTION =
  "50+ free animated SVG icons for React and Next.js. Copy code, download SVG, or install via npm. MIT licensed, open source, tree-shakeable."

export const BASE_KEYWORDS = [
  "free svg icons",
  "animated svg icons",
  "react icon library",
  "next.js icons",
  "svg icon set",
  "ui icons",
  "web icons",
  "icon library",
  "svg animation",
  "open source icons",
  "tailwind icons",
  "lucide alternative",
  "heroicons alternative",
  "react icons",
  "free animated icons",
  "svg icons download",
  "icon npm package",
  "cssvg",
]

export const BASE_OG_IMAGE = [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "cssvg-icon — Animated SVG Icons for React and Next.js",
  },
]
