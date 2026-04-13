import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: "Premium Portfolio",
  description: "A sleek, ultra-premium portfolio engineered for impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="glass-main relative mx-auto max-w-4xl min-h-screen w-full sm:px-12 px-4 transition-colors duration-300">
            {children}
          </div>
          {/* fixed bottom scroll-fade — the premium glass scroll transition */}
          <div className="scroll-fade-overlay" />
        </ThemeProvider>
      </body>
    </html>
  );
}
