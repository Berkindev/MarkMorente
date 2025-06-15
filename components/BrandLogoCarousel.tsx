"use client";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";

// Brand logoları public/brandlogo klasöründe
const BRAND_LOGOS = [
  "mariobosso620.png",
  "mariolorenso620.png",
  "robertolorenso620.png",
  "paulvictor620.png",
  "empiremarie620.png",
  "marcocarloti620.png",
  "sagrez620.png",
  "oneberry620.png",
  "marcosimone620.png",
  "rosler620.png",
];

export default function BrandLogoCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % BRAND_LOGOS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Brand Logos"
      className="w-full flex justify-center items-center my-4"
    >
      <Carousel
        opts={{ loop: true, align: "center", slidesToScroll: 1 }}
        className="w-full max-w-4xl h-24 flex items-center justify-center relative"
      >
        <CarouselContent data-carousel-content>
          {BRAND_LOGOS.map((logo, idx) => (
            <CarouselItem
              key={logo}
              className={`flex items-center justify-center px-4 mx-4 transition-opacity duration-500 ${
                active === idx ? "opacity-100" : "opacity-60"
              }`}
              style={{ minWidth: "120px", maxWidth: "160px" }}
            >
              <Image
                src={`/brandlogo/${logo}`}
                alt={logo.replace(/\.png$/, "") + " logo"}
                className="object-contain h-24 w-auto max-w-[176px] mx-auto p-2"
                width={176}
                height={96}
                loading="lazy"
                draggable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
