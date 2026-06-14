import type { Metadata } from "next";
import collectionsData from "@/collections.json";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetail, { Product } from "@/components/ProductDetail";

const SITE_URL = "https://www.markmorente.com";

function getProduct(slug: string): Product | undefined {
  return (collectionsData.products as Product[]).find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return collectionsData.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return { title: "Product Not Found | Mark Morente" };
  }

  const title = `${product.title} | Mark Morente Suit Manufacturer`;
  const description =
    `${product.content} ${product.model} in ${product.color}. ` +
    `Wholesale, OEM & private label men's suits made in Turkey with worldwide shipping.`;
  const url = `${SITE_URL}/collections/${product.slug}`;
  const images = product.images.map((img) => ({
    url: `${SITE_URL}${img}`,
    alt: `${product.title} – ${product.color} ${product.model} by Mark Morente`,
  }));

  return {
    title,
    description,
    keywords: [
      product.title,
      `${product.color} ${product.model}`,
      `${product.model} manufacturer`,
      `wholesale ${product.model}`,
      `private label ${product.model}`,
      `${product.model} Turkey`,
      "men's suit manufacturer",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mark Morente",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return notFound();

  const url = `${SITE_URL}/collections/${product.slug}`;
  const availability =
    product.status === "In Stock"
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => `${SITE_URL}${img}`),
    description: product.content,
    sku: product.code,
    mpn: product.code,
    color: product.color,
    material: product.fabric,
    category: product.model,
    brand: {
      "@type": "Brand",
      name: "Mark Morente",
    },
    offers: {
      "@type": "Offer",
      url,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Mark Morente",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${SITE_URL}/collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <ProductDetail product={product} />
    </>
  );
}
