"use client";
import collectionsData from "@/collections.json";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, use } from "react";

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

interface Product {
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

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product: Product | undefined = collectionsData.products.find(
    (p: Product) => p.slug === slug
  );
  const [mainImg, setMainImg] = useState(product?.images[0] || "");
  if (!product) return notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Main Image and Thumbnails */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full aspect-square relative mb-4 max-w-md">
              <Image
                src={mainImg}
                alt={product.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg border"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setMainImg(img)}
                  className={`border rounded overflow-hidden w-16 h-16 relative ${
                    mainImg === img ? "ring-2 ring-black" : ""
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={product.title + " thumbnail"}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Right: Product Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold font-belleza mb-2">
              {product.title}
            </h1>
            <p className="text-base text-gray-700 mb-2 font-medium">
              {product.content}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 rounded-lg p-4">
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
            <div>
              <h2 className="font-semibold mt-4 mb-1">Features</h2>
              <ul className="list-disc ml-5">
                {product.description.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mt-4 mb-1">Lot Info</h2>
              <div className="flex flex-col gap-2">
                <div
                  className={`grid gap-1 mb-1 w-fit grid-cols-${product.description.lot.sizes.length}`}
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
          </div>
        </div>
      </main>
    </>
  );
}
