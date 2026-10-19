import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

import { Barlow_Condensed, Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
})

const DESCRIPTION =
  "Build your dream NFL roster by spinning for random teams and selecting players. A fun slot machine game for football fans."

// Absolute base for Open Graph URLs: explicit env, Vercel production URL, or local dev.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3002")

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Spin My Roster | NFL Fantasy Team Builder",
  description: DESCRIPTION,
  applicationName: "Spin My Roster",
  generator: "Fran",
  appleWebApp: {
    capable: true,
    title: "Spin Roster",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Spin My Roster",
    title: "Spin My Roster",
    description: DESCRIPTION,
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Spin My Roster" }],
  },
  twitter: {
    card: "summary",
    title: "Spin My Roster",
    description: DESCRIPTION,
    images: ["/icons/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060a0f",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${barlow.variable}`}>
      <body>
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          // Below the status bar / Dynamic Island when installed on a phone
          offset={{ top: "calc(var(--safe-top) + 1rem)" }}
          mobileOffset={{ top: "calc(var(--safe-top) + 0.75rem)" }}
          toastOptions={{
            style: {
              background: "var(--surface-3)",
              border: "1px solid var(--line-strong)",
              color: "var(--smr-text)",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
