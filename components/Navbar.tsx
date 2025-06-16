"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/mens-suit-manufacturing", label: "Manufacturing" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full border-b bg-background sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-12 font-[Belleza,sans-serif]">
        <div className="flex items-center md:hidden">
          <Link href="/">
            <Image
              src="/mmlogo.png"
              alt="Mark Morente Logo"
              width={64}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-10 text-lg font-semibold tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary underline-offset-4 px-2 ${
                  pathname === link.href ? "text-primary underline" : ""
                }`}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100 transition"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 md:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6 p-8 pt-16">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary underline" : ""
                }`}
                onClick={() => setMobileOpen(false)}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
