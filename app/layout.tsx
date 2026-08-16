import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "@/components/SiteFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
});

// Cormorant is the display face (h1-h6 + .font-serif). Headings across the app
// resolve to exactly three weights: 500 (the globals.css default), 600 from
// `font-semibold` and 700 from `font-bold`. 300 and 400 were never rendered.
// Keeping 600/700 matters — dropping them makes the browser synthesise a fake
// bold on /contact, /about-us and the product pages.
const cormorant = Cormorant_Garamond({
  weight: ["500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1f3c",
};

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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mark Morente - Premium Suit Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Morente | Premium Men's Suit Manufacturer",
    description:
      "Premium quality men's suits manufacturer. Private label, OEM, and wholesale production. 1000+ suits daily.",
    images: ["/og-image.jpg"],
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
  logo: `${SITE_URL}/logo-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
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
    "https://t.me/markmorentesuits",
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
        {/* Favicon comes from app/icon.png (48px, hashed + immutably cached).
            The old <link rel="icon" href="/logo.png"> pulled a 315KB file.
            Viewport + theme-color are declared via the `viewport` export. */}
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
        <SiteFooter />
        <FloatingWhatsApp />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
