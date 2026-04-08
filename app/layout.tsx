import { Metadata } from "next"
import Script from "next/script"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cssvg.com").replace(/\/$/, "")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "cssvg-icon | Minimalist Icon System",
    template: "%s | cssvg-icon",
  },
  description: "A clean, developer-first animated SVG icon registry for Next.js and Tailwind CSS.",
  keywords: ["svg icons", "animated icons", "next.js", "tailwind", "cssvg", "react icons"],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "cssvg-icon | Minimalist Icon System",
    description: "A clean, developer-first animated SVG icon registry for Next.js and Tailwind CSS.",
    siteName: "cssvg-icon",
  },
  twitter: {
    card: "summary_large_image",
    title: "cssvg-icon | Minimalist Icon System",
    description: "A clean, developer-first animated SVG icon registry for Next.js and Tailwind CSS.",
    creator: "@cssvg_",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K4NJX5K4');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4NJX5K4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
