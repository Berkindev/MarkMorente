import type { Metadata } from "next";
import { Geist, Geist_Mono, Belleza } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const belleza = Belleza({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-belleza",
});

export const metadata: Metadata = {
  title:
    "MarkMorente | Premium Men's Suit Manufacturer, Private Label & OEM Suits",
  description:
    "Premium quality men's suits manufacturer in Turkey. Private label, OEM, and custom suit production for brands, retailers, and wholesalers. Fast global shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ fontFamily: "'Belleza', sans-serif" }}
      className={`${belleza.variable}`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="canonical" href="https://markmorente.com/" />
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${belleza.variable} antialiased`}
        style={{ fontFamily: "'Belleza', sans-serif" }}
      >
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
