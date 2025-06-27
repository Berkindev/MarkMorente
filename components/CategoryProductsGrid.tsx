"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Product = {
  slug: string;
  title: string;
  images: string[];
};

export default function CategoryProductsGrid({
  products,
  categorySlug,
}: {
  products: Product[];
  categorySlug: string;
}) {
  const [visibleCount, setVisibleCount] = useState(4);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < products.length) {
          setVisibleCount((prev) => Math.min(prev + 4, products.length));
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [visibleCount, products.length]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {products.slice(0, visibleCount).map((product) => (
          <Link
            key={product.slug}
            href={`/collections/${categorySlug}/${product.slug}`}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 flex flex-col hover:scale-105 transition-transform"
            aria-label={product.title}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.title}
                className="object-cover w-full h-full"
                loading="lazy"
                width={400}
                height={500}
                unoptimized
              />
            </div>
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
              <h3 className="text-base md:text-lg font-semibold mb-1 text-center">
                {product.title}
              </h3>
              <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold mb-2 w-fit mx-auto">
                In Stock
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div ref={loader} />
    </>
  );
}
