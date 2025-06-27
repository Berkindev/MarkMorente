"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import collectionsData from "@/collections.json";
import Link from "next/link";
import Image from "next/image";

// Define ProductDescription type based on collections.json structure
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

// Define Product type based on collections.json structure
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
}

const getUniqueModels = (products: Product[]): string[] => {
  const models = products.map((p) => p.model);
  return Array.from(new Set(models));
};

export default function CollectionPage() {
  const products: Product[] = collectionsData.products;
  const models = getUniqueModels(products);
  const [selectedModel, setSelectedModel] = useState<string>("All");

  const filteredProducts =
    selectedModel === "All"
      ? products
      : products.filter((p) => p.model === selectedModel);

  // Remove duplicate products by slug
  const uniqueProducts = filteredProducts.filter(
    (prod, idx, arr) => arr.findIndex((p) => p.slug === prod.slug) === idx
  );

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            key="All"
            className={`px-4 py-2 rounded-full border font-medium transition-colors ${
              selectedModel === "All"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            onClick={() => setSelectedModel("All")}
          >
            All
          </button>
          {models.map((model: string) => (
            <button
              key={model}
              className={`px-4 py-2 rounded-full border font-medium transition-colors ${
                selectedModel === model
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
              onClick={() => setSelectedModel(model)}
            >
              {model}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {uniqueProducts.map((product: Product) => (
            <Link
              key={product.slug}
              href={`/collections/${product.slug}`}
              className="block group"
            >
              <div className="border rounded-xl p-4 hover:shadow-xl transition flex flex-col items-center bg-white dark:bg-zinc-900">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  className="object-cover w-full h-72 rounded mb-2 transition-transform group-hover:scale-105"
                  width={320}
                  height={288}
                  loading="lazy"
                  unoptimized
                />
                <h2 className="font-semibold text-lg mb-2 text-center line-clamp-2 min-h-[3rem]">
                  {product.title}
                </h2>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 w-fit mx-auto ${
                    product.status === "In Stock"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status === "In Stock" ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
