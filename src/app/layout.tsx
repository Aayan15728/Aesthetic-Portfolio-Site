import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeColorSync } from "@/components/theme-provider";
import { FloatingRail } from "@/components/floating-rail";
import { CommandPalette } from "@/components/command-palette";
import { BottomGlass } from "@/components/bottom-glass";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteCursor } from "@/components/site-cursor";
import { personJsonLd, siteConfig } from "@/lib/site";

// Load Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Load Instrument Serif for display headings
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

// Load Geist for book names on the collection page
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // lets the page extend under notches / home indicators; safe-area insets keep controls clear of them
  viewportFit: "cover",
  // browser UI colour; kept in sync with the theme toggle by <ThemeColorSync />
  themeColor: "#FCFCFC",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  title: {
    default: siteConfig.title,
    template: "%s | Aayan Sharma",
  },
  description: siteConfig.description,
  keywords: [
    "aayan sharma",
    "aayan sharma portfolio",
    "aayan sharma developer",
    "full stack developer",
    "next.js developer",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_US",
    images: [
      {
        url: siteConfig.image,
        width: 1200,
        height: 630,
        alt: "Aayan Sharma portfolio open graph image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.image],
    site: "@aayanships",
    creator: "@aayanships",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "7wODZSiTSRMywC9MxGgrJwLzRS8FluJuNR8UbspfIOw",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable} ${geist.variable} antialiased`}>
      <body className="min-h-dvh bg-background text-foreground selection:bg-foreground selection:text-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ThemeColorSync />
          <SmoothScroll />
          <SiteCursor />
          {/* clips the 100vw-wide dotted rules; body overflow alone doesn't, since it's handed to the viewport */}
          <div className="overflow-x-clip">
            <div className="frame">{children}</div>
          </div>
          <FloatingRail />
          <CommandPalette />
          {/* fixed bottom glass band: content blurs progressively as it scrolls underneath */}
          <BottomGlass />
        </ThemeProvider>
      </body>
    </html>
  );
}
