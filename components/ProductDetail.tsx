"use client";
import Image from "next/image";
import { useState } from "react";

interface ProductDescription {
  compositions: {
    [key: string]: string;
  };
  features: string[];
  lot: {
    sizes: string[];
    quantities: number[];
    total: string;
  };
}

export interface Product {
  slug: string;
  title: string;
  model: string;
  fit: string;
  lapel: string;
  fabric: string;
  lining: string;
  color: string;
  code: string;
  images: string[];
  status: string;
  description: ProductDescription;
  content: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  const [mainImg, setMainImg] = useState(product.images[0] || "");

  const whatsappHref =
    "https://wa.me/905321711494?text=" +
    encodeURIComponent(
      `Hello Mark Morente, I'm interested in the "${product.title}" (Code: ${product.code}). Could you please share pricing, MOQ and availability?`
    );

  return (
    <main className="max-w-4xl mx-auto py-10 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row gap-10 items-start md:items-start">
        {/* Left: Main Image and Thumbnails */}
        <div className="flex-1 flex flex-col items-center mb-6 md:mb-0 w-full">
          <div className="w-full aspect-square relative mb-4 md:mb-8 max-w-md rounded-xl overflow-hidden shadow border">
            <Image
              src={mainImg}
              alt={`${product.title} – ${product.color} ${product.model} by Mark Morente`}
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              className="rounded-xl border"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              unoptimized
            />
          </div>
          <div className="flex gap-3 flex-wrap justify-center mb-4 md:mb-6">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setMainImg(img)}
                className={`border rounded-xl overflow-hidden w-16 h-16 md:w-16 md:h-16 w-20 h-20 relative transition-all duration-150 bg-white shadow-sm ${
                  mainImg === img ? "ring-2 ring-primary" : ""
                }`}
                aria-label={`Show ${product.title} image ${i + 1}`}
                style={{ touchAction: "manipulation" }}
              >
                <Image
                  src={img}
                  alt={`${product.title} – view ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="80px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col items-center w-full space-y-8">
          <h1 className="text-2xl md:text-3xl font-bold font-belleza mb-4 text-center max-w-xl">
            {product.title}
          </h1>
          <p className="text-base text-gray-700 mb-4 font-medium text-center max-w-lg">
            {product.content}
          </p>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-50 rounded-2xl p-6 shadow max-w-md w-full">
              <span className="font-semibold">Model:</span>{" "}
              <span>{product.model}</span>
              <span className="font-semibold">Fit:</span>{" "}
              <span>{product.fit}</span>
              <span className="font-semibold">Fabric:</span>{" "}
              <span>{product.fabric}</span>
              <span className="font-semibold">Lining:</span>{" "}
              <span>{product.lining}</span>
              <span className="font-semibold">Color:</span>{" "}
              <span>{product.color}</span>
              <span className="font-semibold">Code:</span>{" "}
              <span>{product.code}</span>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`font-bold ${
                  product.status === "In Stock"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.status === "In Stock" ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col items-center mt-2">
            <h2 className="font-semibold mt-2 mb-2 text-lg text-center">
              Features
            </h2>
            <ul className="list-disc flex flex-col justify-center items-center space-y-1 max-w-md mx-auto pl-0 mb-1">
              {product.description.features.map((feature, index) => (
                <li key={index} className="text-left list-inside w-full">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex flex-col items-center mt-0">
            <h2 className="font-semibold mt-2 mb-2 text-lg text-center">
              Lot Info
            </h2>
            <div className="flex flex-col gap-2 items-center">
              <div
                className="grid gap-1 mb-1 w-fit"
                style={{
                  gridTemplateColumns: `repeat(${product.description.lot.sizes.length}, minmax(0, 1fr))`,
                }}
              >
                {product.description.lot.sizes.map((size, idx) => (
                  <div key={size} className="flex flex-col items-center">
                    <span className="inline-block px-2 py-0.5 rounded border bg-white text-gray-900 font-semibold text-xs shadow-sm mb-0.5 min-w-[32px]">
                      {size}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium min-w-[32px] text-center">
                      {product.description.lot.quantities[idx]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">
                {product.description.lot.total}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="w-full flex flex-col items-center mt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-7 py-4 rounded-full text-base shadow-md transition-all hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Image src="/whatsapplogo.svg" alt="WhatsApp" width={24} height={24} unoptimized />
              I&apos;m interested in this product
            </a>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Message us on WhatsApp for pricing, MOQ and availability — typically replies within 1 hour.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
