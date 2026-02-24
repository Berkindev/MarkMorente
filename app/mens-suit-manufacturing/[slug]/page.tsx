"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import categoriesDataRaw from "@/categories.json";
import { notFound } from "next/navigation";
import { use } from "react";
import manufacturingData from "@/manufacturing.json";
import Link from "next/link";

interface Category {
  slug: string;
  title: string;
  image: string;
  content: string;
  keywords?: string[];
}

interface Section {
  type: string;
  title?: string;
  content?: string;
  cta?: string;
  cta_link?: string;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const categories: Category[] =
    (categoriesDataRaw as { page?: { categories?: Category[] } }).page
      ?.categories ||
    (categoriesDataRaw as { categories?: Category[] }).categories ||
    [];
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) return notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <section className="mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-full md:w-1/2 aspect-[4/3] relative rounded-xl overflow-hidden shadow border mb-6 md:mb-0">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              unoptimized
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold font-belleza mb-4">
              {category.title}
            </h1>
            <p className="text-lg text-gray-700 mb-2">{category.content}</p>
            {category.keywords && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {category.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
        <div className="flex flex-col items-center mb-10">
          <Link
            href="/collections"
            className="inline-block text-primary font-semibold underline underline-offset-4 text-lg hover:text-primary/80 transition mb-6"
          >
            View in Collections &rarr;
          </Link>
        </div>
        {(() => {
          const cta = ((manufacturingData.sections as Section[]) || []).find(
            (s) => s.type === "cta"
          );
          if (!cta) return null;
          return (
            <section className="mb-0 flex flex-col items-center justify-center border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                {cta.title}
              </h2>
              <p className="mb-4 text-center text-gray-700 max-w-xl">
                {cta.content}
              </p>
              <a
                href={cta.cta_link}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full text-lg shadow transition"
              >
                <span className="w-7 h-7 inline-block align-middle">
                  <Image
                    src="/whatsapplogo.svg"
                    alt="WhatsApp"
                    width={28}
                    height={28}
                    unoptimized
                  />
                </span>
                {cta.cta}
              </a>
            </section>
          );
        })()}
      </main>
    </>
  );
}
