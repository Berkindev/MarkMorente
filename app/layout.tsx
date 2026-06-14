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
  metadataBase: new URL("https://www.markmorente.com"),
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
  alternates: {
    canonical: "/",
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

const SITE_URL = "https://www.markmorente.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Mark Morente",
  alternateName: "MarkMorente",
  url: SITE_URL,
  logo: `${SITE_URL}/mmlogo.png`,
  image: `${SITE_URL}/mmlogo.png`,
  description:
    "Premium men's suit manufacturer based in Istanbul, Turkey. Private label, OEM and wholesale production of suits, tuxedos and ceremony wear with worldwide shipping.",
  foundingLocation: "Istanbul, Turkey",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90-532-171-1494",
    contactType: "sales",
    areaServed: ["US", "GB", "EU", "AE", "Worldwide"],
    availableLanguage: ["English", "Turkish"],
  },
  sameAs: [
    "https://www.instagram.com/mark.morente/",
    "https://wa.me/905321711494",
    "https://t.me/markmorente",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mark Morente",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
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
        <meta name="theme-color" content="#1a1f3c" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#faf9f6] text-[#2d2d2d]" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
