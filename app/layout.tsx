import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" style={{ fontFamily: "'Belleza', sans-serif" }}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "'Belleza', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
