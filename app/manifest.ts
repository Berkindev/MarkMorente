import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mark Morente | Men's Suit Manufacturer",
    short_name: "Mark Morente",
    description:
      "Premium men's suit, tuxedo and ceremony wear manufacturer. Private label, OEM and wholesale production from Istanbul, Turkey.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#1a1f3c",
    icons: [
      { src: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
