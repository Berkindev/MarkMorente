import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mark Morente | Premium Men's Suit Manufacturer, Private Label & OEM Suits",
  description:
    "Premium quality men's suits manufacturer. Private label, OEM, and wholesale suit production for brands, retailers, and wholesalers. 1000+ suits daily capacity with fast global shipping.",
  keywords: [
    "men's suit manufacturer",
    "private label suits",
    "OEM suit production",
    "wholesale men's suits",
    "suit manufacturer",
    "B2B suits",
    "tuxedo manufacturer",
    "wedding suits wholesale",
  ],
  authors: [{ name: "Mark Morente" }],
  creator: "Mark Morente",
  publisher: "Mark Morente",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "Mark Morente | Premium Men's Suit Manufacturer",
    description:
      "Premium quality men's suits manufacturer. Private label, OEM, and wholesale production for global brands. 1000+ suits daily.",
    url: "https://www.markmorente.com",
    siteName: "Mark Morente",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/mmlogo.png",
        width: 800,
        height: 600,
        alt: "Mark Morente - Premium Suit Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Morente | Premium Men's Suit Manufacturer",
    description:
      "Premium quality men's suits manufacturer. Private label, OEM, and wholesale production. 1000+ suits daily.",
    images: ["/mmlogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="canonical" href="https://www.markmorente.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1a1f3c" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-[#faf9f6] text-[#2d2d2d]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
