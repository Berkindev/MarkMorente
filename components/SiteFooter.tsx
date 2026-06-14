import Image from "next/image";
import Link from "next/link";

const WHATSAPP =
  "https://wa.me/905321711494?text=" +
  encodeURIComponent(
    "Hello Mark Morente, I'm contacting you from your website and would like to get a quote."
  );

const quickLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/mens-suit-manufacturing", label: "Manufacturing" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 py-12 px-4 md:px-8 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Mark Morente"
                width={180}
                height={60}
                className="h-14 w-auto brightness-0 invert"
                unoptimized
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Premium men&apos;s suit manufacturer specializing in Private Label,
              OEM &amp; Wholesale production. 1000+ suits daily capacity with
              modern tailoring, based in Istanbul, Turkey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-[#c9a962] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>Istanbul, Turkey</li>
              <li>
                <a href="tel:+905321711494" className="hover:text-[#c9a962] transition-colors">
                  +90 532 171 14 94
                </a>
              </li>
              <li>
                <a href="mailto:info@markmorente.com" className="hover:text-[#c9a962] transition-colors">
                  info@markmorente.com
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/whatsapplogo.svg" alt="WhatsApp" width={24} height={24} unoptimized />
              </a>
              <a
                href="https://t.me/markmorente"
                target="_blank"
                rel="noopener"
                aria-label="Telegram"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/telegramlogo.svg" alt="Telegram" width={24} height={24} unoptimized />
              </a>
              <a
                href="https://www.instagram.com/mark.morente/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/instagramlogo.png" alt="Instagram" width={24} height={24} unoptimized />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Mark Morente. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Premium Men&apos;s Suit Manufacturer — Made in Turkey
          </p>
        </div>
      </div>
    </footer>
  );
}
