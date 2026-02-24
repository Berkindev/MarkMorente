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

export default function CollectionPage() {
  const products: Product[] = collectionsData.products;

  // Remove duplicate products by slug
  const uniqueProducts = products.filter(
    (prod, idx, arr) => arr.findIndex((p) => p.slug === prod.slug) === idx
  );

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-5xl text-[#1a1f3c] mb-4">
            Our Collections
          </h1>
          <p className="text-[#8b8680] max-w-2xl mx-auto">
            Explore our premium range of men&apos;s suits, crafted with excellence.
          </p>
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
                  className="object-cover object-top w-full h-72 rounded mb-2 transition-transform group-hover:scale-105"
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
