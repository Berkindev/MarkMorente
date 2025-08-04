"use client";
import Image from "next/image";
import Link from "next/link";
import collectionsData from "../collections.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import Navbar from "../components/Navbar";
import { useRef, useEffect } from "react";
// import BrandLogoCarousel from "../components/BrandLogoCarousel";
import mmlogo from "../public/mmlogo.png";

// Carousel Placeholder (shadcn carousel ile değiştirilecek)
function HomeCarousel() {
  const products = collectionsData.products;
  const carouselRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const el = (carouselRef.current as HTMLElement).querySelector(
        "[data-carousel-content]"
      ) as HTMLElement | null;
      if (!el) return;
      const items = Array.from(el.children) as HTMLElement[];
      const total = items.length;
      let active = items.findIndex((item) => item.classList.contains("active"));
      if (active === -1) active = 0;
      const next = (active + 1) % total;
      items[active].classList.remove("active");
      items[next].classList.add("active");
      el.scrollTo({ left: items[next].offsetLeft, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section
      aria-label="Lookbook"
      className="w-full flex justify-center items-center mt-0 mb-4"
      ref={carouselRef}
    >
      <Carousel
        opts={{ loop: true, align: "start", slidesToScroll: 1 }}
        className="w-full max-w-6xl h-[400px] flex items-center justify-center relative"
      >
        <CarouselContent data-carousel-content>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className="pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 xl:basis-1/4 flex items-center justify-center h-[370px]"
            >
              <article className="w-full h-full flex flex-col items-center justify-center">
                <Link
                  href={`/collections/${product.slug}`}
                  className="block w-full h-full group focus:outline-none"
                  prefetch={false}
                  aria-label={product.title}
                >
                  <div className="border rounded-xl p-2 flex flex-col items-center bg-white dark:bg-zinc-900 shadow hover:shadow-xl transition h-full">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-cover w-full h-72 rounded mb-2 transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <h3 className="font-semibold text-base text-center line-clamp-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>
                  </div>
                </Link>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="w-full flex justify-center mt-8">
      <div className="flex gap-4 items-center bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg">
        <span className="font-semibold text-lg">Contact Us</span>
        <a
          href="https://t.me/markmorente"
          target="_blank"
          rel="noopener"
          aria-label="Telegram"
          className="hover:opacity-80"
        >
          <Image
            src="/telegramlogo.svg"
            alt="Telegram Logo"
            width={28}
            height={28}
            className="w-7 h-7"
            unoptimized
          />
        </a>
        <a
          href="https://wa.me/905321711494"
          target="_blank"
          rel="noopener"
          aria-label="WhatsApp"
          className="hover:opacity-80"
        >
          <Image
            src="/whatsapplogo.svg"
            alt="Whatsapp Logo"
            width={28}
            height={28}
            className="w-7 h-7"
            unoptimized
          />
        </a>
        <a
          href="https://www.instagram.com/mark.morente/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          className="hover:opacity-80"
        >
          <Image
            src="/instagramlogo.png"
            alt="Instagram Logo"
            width={28}
            height={28}
            className="w-7 h-7"
            unoptimized
          />
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-4 w-full">
        <div className="container mx-auto max-w-7xl xl:max-w-[1600px] flex flex-col items-center">
          <div className="mt-0 mb-2">
            <Image
              src={mmlogo}
              alt="Mark Morente - Men's Suit Manufacturer Logo"
              width={180}
              height={120}
              className="h-20 md:h-28 xl:h-36 w-auto mx-auto"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            Premium Men&apos;s Suit Manufacturer
            <br />
            Custom, OEM & Private Label Production
          </h1>
          <p className="text-lg md:text-xl text-center mb-4 max-w-2xl">
            We produce premium-quality custom, private label, and wholesale
            men&apos;s suits with high daily capacity, modern fits, and fast
            global delivery — combining precision tailoring with exceptional
            craftsmanship.
          </p>
        </div>
        <HomeCarousel />
        {/* <BrandLogoCarousel /> */}
        <div className="w-full flex-shrink-0 mt-2">
          <ContactCTA />
        </div>
      </main>
    </div>
  );
}
