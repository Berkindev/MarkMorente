"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import collectionsData from "../collections.json";

// ============================================
// NAVIGATION COMPONENT
// ============================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#collections", label: "Collections" },
    { href: "#fabrics", label: "Fabrics" },
    { href: "#manufacturing", label: "Manufacturing" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#faf9f6]/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Mark Morente Logo"
              width={240}
              height={100}
              className={`transition-all duration-500 drop-shadow-lg ${
                isScrolled ? "h-16 w-auto" : "h-20 w-auto"
              }`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-[#c9a962] ${
                  isScrolled ? "text-[#2d2d2d]" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/905321711494?text=Hi, I'm reaching out from your website and would like to get a quote."
              target="_blank"
              rel="noopener"
              className="btn-primary ml-4"
            >
              Inquire via WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-[#1a1f3c]" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 mobile-menu-enter">
            <div className="flex flex-col gap-4 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#1a1f3c] text-base font-medium tracking-wide py-2 border-b border-[#e5e4e0] last:border-0 hover:text-[#c9a962] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://wa.me/905321711494?text=Hi, I'm reaching out from your website and would like to get a quote."
                target="_blank"
                rel="noopener"
                className="btn-primary text-center mt-2"
              >
                Inquire via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative bg-[#1a1f3c] overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a962\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-24 pt-28 pb-12 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20">
        {/* Top: Brand badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 md:w-12 h-[1px] bg-[#c9a962]" />
          <span className="text-[#c9a962] text-xs md:text-sm font-medium tracking-[0.3em] md:tracking-[0.4em] uppercase hero-subtitle">
            Est. 1994 — Istanbul, Turkey
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-medium leading-[1.1] mb-5 hero-title max-w-4xl">
          Premium Suit
          <br />
          <span className="text-[#c9a962]">Manufacturing</span>
        </h1>

        <p className="text-sm md:text-base lg:text-lg text-white/70 max-w-2xl mb-8 font-light leading-relaxed hero-subtitle">
          Private Label, OEM & Wholesale suit production for global brands,
          retailers, and distributors. From fabric selection to finished
          garments — all under one roof.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-10 hero-subtitle">
          <a
            href="https://wa.me/905321711494?text=Hi, I would like to get a quote for wholesale suits."
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-7 md:py-4 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-300 bg-[#c9a962] text-[#1a1f3c] hover:bg-[#d4ba7a] hover:shadow-lg hover:shadow-[#c9a962]/20"
          >
            Inquire via WhatsApp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-7 md:py-4 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-300 border border-white/30 text-white hover:border-[#c9a962] hover:text-[#c9a962]"
          >
            View Collections
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-white/10">
          {[
            { value: "20+", label: "Years Experience" },
            { value: "1000+", label: "Suits Per Day" },
            { value: "50+", label: "Global Partners" },
            { value: "100+", label: "MOQ Per Style" },
          ].map((stat, index) => (
            <div key={index} className="hero-subtitle" style={{ animationDelay: `${0.8 + index * 0.15}s` }}>
              <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#c9a962] font-medium mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-[10px] md:text-xs tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// COLLECTIONS SECTION
// ============================================
function CollectionsSection() {
  const products = [...collectionsData.products.slice(-4), ...collectionsData.products.slice(-8, -4)];

  return (
    <section id="collections" className="section-padding bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#c9a962] text-sm font-medium tracking-[0.3em] uppercase">
            Our Collection
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1a1f3c] mt-4 mb-6">
            Premium Suit Catalog
          </h2>
          <div className="gold-line-center mb-6" />
          <p className="text-[#8b8680] max-w-2xl mx-auto text-base md:text-lg">
            Discover our extensive range of premium men&apos;s suits, from classic
            business attire to sophisticated ceremony tuxedos.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/collections/${product.slug}`}
              className="group"
            >
              <article className="card-hover bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                <div className="image-hover aspect-[3/4] relative">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#1a1f3c]/0 group-hover:bg-[#1a1f3c]/20 transition-colors duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base md:text-lg text-[#1a1f3c] group-hover:text-[#c9a962] transition-colors truncate">
                    {product.title}
                  </h3>
                  <p className="text-[#8b8680] text-sm mt-1">
                    {product.model} • {product.fit}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/collections" className="btn-primary">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FABRICS SECTION
// ============================================
function FabricsSection() {
  const fabrics = [
    {
      name: "Italian Wool",
      description: "Super 120s-180s premium wool",
      image: "/collections/4/mark-morente-three-piece-suit-01.png",
    },
    {
      name: "Wool Blend",
      description: "Durable & comfortable blends",
      image: "/collections/4/mark-morente-three-piece-suit-02.png",
    },
    {
      name: "Jacquard",
      description: "Textured luxury patterns",
      image: "/collections/1/mark-morente-double-breasted-suit-01.jpeg",
    },
    {
      name: "Cotton Blend",
      description: "Breathable summer suits",
      image: "/collections/3/mark-morente-formal-suit-01.png",
    },
  ];

  return (
    <section id="fabrics" className="section-padding bg-[#1a1f3c]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#c9a962] text-sm font-medium tracking-[0.3em] uppercase">
            Premium Materials
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mt-4 mb-6">
            Fabric Collection
          </h2>
          <div className="gold-line-center mb-6" />
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
            We source only the finest fabrics from renowned mills. Each material
            is carefully selected for its quality, durability, and luxurious feel.
          </p>
        </div>

        {/* Fabrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {fabrics.map((fabric, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square relative">
                <Image
                  src={fabric.image}
                  alt={fabric.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-serif text-lg md:text-xl text-white mb-1">
                  {fabric.name}
                </h3>
                <p className="text-white/70 text-sm">{fabric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/70 mb-6">
            Request our complete fabric sample book for your next collection
          </p>
          <a
            href="https://wa.me/905321711494?text=Hi, I would like to request a fabric sample book."
            target="_blank"
            rel="noopener"
            className="btn-outline"
          >
            Request Fabric Samples
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MANUFACTURING SECTION
// ============================================
function ManufacturingSection() {
  const services = [
    {
      title: "Private Label",
      description:
        "Launch your own brand with our full Private Label services. Complete control over design, fabric, labels, and packaging.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      title: "OEM Production",
      description:
        "Suits manufactured to your exact technical specifications. Perfect for established brands requiring high precision.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Wholesale",
      description:
        "High-volume production at competitive prices. Serving retail chains, importers, and distributors globally.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const specs = [
    { label: "Daily Capacity", value: "1000+ Suits" },
    { label: "MOQ", value: "100+ Units/Style" },
    { label: "Lead Time", value: "14-21 Days" },
    { label: "Delivery", value: "Worldwide" },
  ];

  return (
    <section id="manufacturing" className="section-padding bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#c9a962] text-sm font-medium tracking-[0.3em] uppercase">
            B2B Services
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1a1f3c] mt-4 mb-6">
            Manufacturing Services
          </h2>
          <div className="gold-line-center mb-6" />
          <p className="text-[#8b8680] max-w-2xl mx-auto text-base md:text-lg">
            Full-scale suit manufacturing solutions for fashion brands, retailers,
            and wholesalers worldwide.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-hover bg-white p-6 md:p-8 rounded-lg text-center shadow-sm border border-[#e5e4e0]"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1f3c] text-[#c9a962] mb-6">
                {service.icon}
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-[#1a1f3c] mb-3">
                {service.title}
              </h3>
              <p className="text-[#8b8680] text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Specs Bar */}
        <div className="bg-[#1a1f3c] rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {specs.map((spec, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-2xl md:text-3xl text-[#c9a962] mb-2">
                  {spec.value}
                </div>
                <div className="text-white/70 text-sm tracking-wider uppercase">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ABOUT SECTION
// ============================================
function AboutSection() {
  const features = [
    "Full OEM & Private Label Support",
    "In-house Pattern Making & Sampling",
    "Fast Turnaround Time",
    "Quality Control at Every Step",
    "ISO 9001 Certified Production",
    "OEKO-TEX Standard 100 Fabrics",
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/collections/4/mark-morente-three-piece-suit-04.png"
                alt="Mark Morente Manufacturing"
                fill
                className="object-cover object-top"
                loading="lazy"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 right-0 md:-right-8 bg-[#1a1f3c] text-white p-6 md:p-8 rounded-lg shadow-xl max-w-[200px] md:max-w-[240px]">
              <div className="font-serif text-3xl md:text-4xl text-[#c9a962] mb-2">20+</div>
              <div className="text-sm text-white/80">Years of Excellence in Turkish Suit Manufacturing</div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="text-[#c9a962] text-sm font-medium tracking-[0.3em] uppercase">
              About Us
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1a1f3c] mt-4 mb-6">
              Precision Tailoring Meets Modern Manufacturing
            </h2>
            <div className="gold-line mb-8" />

            <p className="text-[#2d2d2d] text-base md:text-lg leading-relaxed mb-6">
              Founded in Istanbul, Mark Morente has been producing premium men&apos;s
              suits for over 20 years. Our mission is to combine Turkish textile
              excellence with modern tailoring, helping fashion brands bring their
              vision to life.
            </p>

            <p className="text-[#8b8680] leading-relaxed mb-8">
              We offer full-scale OEM, private label, and wholesale suit production
              for global brands, retailers, and distributors. With 1000+ daily
              capacity and modern production technologies, we deliver scalable,
              premium-quality suits made from top-grade fabrics.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c9a962]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#c9a962]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[#2d2d2d] text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/about-us" className="btn-primary">
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-[#c9a962] text-sm font-medium tracking-[0.3em] uppercase">
              Get In Touch
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mt-4 mb-6">
              Let&apos;s Manufacture Together
            </h2>
            <div className="gold-line mb-8" />

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10">
              Ready to scale your brand? Contact us for a detailed quote
              for your private label, OEM, or wholesale suit production needs.
            </p>

            {/* Contact Methods */}
            <div className="space-y-6 mb-10">
              <a
                href="https://wa.me/905321711494?text=Hello, I'm ready to discuss my suit manufacturing needs and would like to get a quote."
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 text-white hover:text-[#c9a962] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1f3c] flex items-center justify-center group-hover:bg-[#c9a962] transition-colors">
                  <Image src="/whatsapplogo.svg" alt="WhatsApp" width={24} height={24} />
                </div>
                <div>
                  <div className="text-sm text-white/60">WhatsApp</div>
                  <div className="font-medium">+90 532 171 14 94</div>
                </div>
              </a>

              <a
                href="https://t.me/markmorente"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 text-white hover:text-[#c9a962] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1f3c] flex items-center justify-center group-hover:bg-[#c9a962] transition-colors">
                  <Image src="/telegramlogo.svg" alt="Telegram" width={24} height={24} />
                </div>
                <div>
                  <div className="text-sm text-white/60">Telegram</div>
                  <div className="font-medium">@markmorente</div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/mark.morente/"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 text-white hover:text-[#c9a962] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1f3c] flex items-center justify-center group-hover:bg-[#c9a962] transition-colors">
                  <Image src="/instagramlogo.png" alt="Instagram" width={24} height={24} />
                </div>
                <div>
                  <div className="text-sm text-white/60">Instagram</div>
                  <div className="font-medium">@mark.morente</div>
                </div>
              </a>
            </div>

            {/* Location */}
            <div className="pt-8 border-t border-white/10">
              <div className="text-white/60 text-sm mb-2">Headquarters</div>
              <div className="text-white">Istanbul</div>
              <div className="text-white/60 text-sm mt-1">
                Shipping worldwide • Europe 3-5 days • USA 5-7 days
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-[#1a1f3c] rounded-xl p-8 md:p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center mb-6">
              <Image src="/whatsapplogo.svg" alt="WhatsApp" width={40} height={40} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">
              Start a Conversation
            </h3>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Ready to discuss your next collection? Message us directly on WhatsApp for fast, personalized service.
            </p>
            <a
              href="https://wa.me/905321711494?text=Hello%2C%20I%27m%20interested%20in%20your%20suit%20manufacturing%20services."
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-medium text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Image src="/whatsapplogo.svg" alt="WhatsApp" width={24} height={24} />
              Message on WhatsApp
            </a>
            <p className="text-white/50 text-sm mt-6">
              Typically responds within 1 hour
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
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
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Premium men&apos;s suit manufacturer specializing in Private Label, OEM
              & Wholesale production. 1000+ suits daily capacity with
              modern tailoring since 2003.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "#collections", label: "Collections" },
                { href: "#fabrics", label: "Fabrics" },
                { href: "#manufacturing", label: "Manufacturing" },
                { href: "#about", label: "About Us" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-[#c9a962] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>Istanbul</li>
              <li>+90 532 171 14 94</li>
              <li>info@markmorente.com</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="https://wa.me/905321711494?text=Hi Mark Morente team, I'm contacting you from your website."
                target="_blank"
                rel="noopener"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/whatsapplogo.svg" alt="WhatsApp" width={24} height={24} />
              </a>
              <a
                href="https://t.me/markmorente"
                target="_blank"
                rel="noopener"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/telegramlogo.svg" alt="Telegram" width={24} height={24} />
              </a>
              <a
                href="https://www.instagram.com/mark.morente/"
                target="_blank"
                rel="noopener"
                className="text-white/60 hover:text-[#c9a962] transition-colors"
              >
                <Image src="/instagramlogo.png" alt="Instagram" width={24} height={24} />
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
            Premium Men&apos;s Suit Manufacturer
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CollectionsSection />
      <FabricsSection />
      <ManufacturingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
