import footerData from "@/footer.json";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-gray-200 mt-16 text-foreground font-belleza">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Desktop: 3 columns */}
        <div className="hidden md:flex flex-row md:items-start gap-10 md:gap-16">
          {/* Navigation */}
          <div className="flex-1 min-w-[160px] mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 tracking-wide uppercase text-primary text-left">
              Mark Morente
            </h3>
            <ul className="space-y-2">
              {footerData.navigation.map((nav) => (
                <li key={nav.url}>
                  <Link
                    href={nav.url}
                    className="hover:text-primary transition-colors text-base font-medium"
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Product Categories */}
          <div className="flex-1 min-w-[180px] mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 tracking-wide uppercase text-primary text-left leading-tight">
              Men&apos;s Suits
              <br />
              Manufacturer
            </h3>
            <ul className="space-y-2">
              {footerData.product_categories.map((cat) => (
                <li key={cat.url}>
                  <Link
                    href={cat.url}
                    className="hover:text-primary transition-colors text-base font-medium"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Socials */}
          <div className="flex-1 min-w-[160px] flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 tracking-wide uppercase text-primary text-left">
              Contact Us
            </h3>
            <ul className="flex gap-4 items-center mb-4">
              {footerData.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition border border-primary/10"
                  >
                    <Image
                      src={social.icon}
                      alt={social.platform}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Mobile: 2 columns grid for nav/categories, contact centered below */}
        <div className="md:hidden flex flex-col items-center w-full gap-8">
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Navigation */}
            <div className="flex flex-col items-center min-w-0">
              <h3 className="text-base font-semibold mb-3 tracking-wide uppercase text-primary text-center">
                Mark Morente
              </h3>
              <ul className="space-y-1 text-[15px] text-center">
                {footerData.navigation.map((nav) => (
                  <li key={nav.url}>
                    <Link
                      href={nav.url}
                      className="hover:text-primary transition-colors font-medium"
                    >
                      {nav.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Product Categories */}
            <div className="flex flex-col items-center min-w-0">
              <h3 className="text-sm font-semibold mb-3 tracking-wide uppercase text-primary text-center leading-tight">
                Men&apos;s Suits
                <br />
                Manufacturer
              </h3>
              <ul className="space-y-1 text-[15px] text-center">
                {footerData.product_categories.map((cat) => (
                  <li key={cat.url}>
                    <Link
                      href={cat.url}
                      className="hover:text-primary transition-colors font-medium"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Contact Us centered below */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-base font-semibold mb-3 tracking-wide uppercase text-primary text-center">
              Contact Us
            </h3>
            <ul className="flex gap-4 items-center mb-2">
              {footerData.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition border border-primary/10"
                  >
                    <Image
                      src={social.icon}
                      alt={social.platform}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Footer note always at the very bottom, above copyright */}
        <div className="max-w-5xl mx-auto px-4 pt-8 text-center text-sm text-gray-500">
          {footerData.footer_note}
        </div>
        {/* Copyright for all screens */}
        <div className="max-w-5xl mx-auto px-4 pb-8 pt-2 text-center text-xs text-gray-400">
          {footerData.copyright}
        </div>
      </div>
    </footer>
  );
}
