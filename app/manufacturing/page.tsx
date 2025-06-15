import Navbar from "@/components/Navbar";
import manufacturingData from "@/manufacturing.json";
import categoriesDataRaw from "@/categories.json";
import Link from "next/link";
import Image from "next/image";

// Category type for TS
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
  categories?: Category[] | string[];
  items?: { title: string; content: string; keywords?: string[] }[];
  content?: string;
  keywords?: string[];
  image?: string;
  cta?: string;
  cta_link?: string;
}

const categories: Category[] =
  (categoriesDataRaw as unknown as { page?: { categories?: Category[] } }).page
    ?.categories ||
  (categoriesDataRaw as unknown as { categories?: Category[] }).categories ||
  [];

export const metadata = {
  title: manufacturingData.meta.title,
  description: manufacturingData.meta.description,
  keywords: manufacturingData.meta.keywords
    .concat(
      ...(categories || []).flatMap((cat: Category) => cat.keywords || [])
    )
    .join(", "),
};

export default function ManufacturingPage() {
  const sections: Section[] = manufacturingData.sections;
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* HERO */}
        <section className="mb-8 md:mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-belleza mb-4">
            {manufacturingData.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            {manufacturingData.meta.description}
          </p>
        </section>
        {/* PRODUCT CATEGORIES */}
        {(() => {
          const categoriesSection = manufacturingData.sections.find(
            (s) => s.type === "categories"
          );
          const categories = categoriesSection?.categories;
          return (
            <section className="mb-12 md:mb-20">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Product Categories
              </h2>
              <ul className="list-disc list-inside max-w-xl mx-auto text-lg text-gray-800 space-y-2">
                {categories?.map((cat, idx) => {
                  if (typeof cat === "string") {
                    return <li key={cat + "-" + idx}>{cat}</li>;
                  } else if (cat && typeof cat === "object" && "title" in cat) {
                    const c = cat as Category;
                    return <li key={c.title + "-" + idx}>{c.title}</li>;
                  }
                  return null;
                })}
              </ul>
              <div className="mt-8 text-center">
                <Link
                  href="/collections"
                  className="inline-block text-primary font-semibold underline underline-offset-4 text-lg hover:text-primary/80 transition"
                >
                  View all collections &rarr;
                </Link>
              </div>
            </section>
          );
        })()}
        {/* DYNAMIC SECTIONS */}
        {sections.map((section, idx) => {
          if (section.type === "categories") return null;
          if (section.type === "services") {
            return (
              <section key={idx} className="mb-12 md:mb-20 flex justify-center">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-0 flex flex-col gap-0">
                  <div className="rounded-t-2xl bg-white/90 border-b border-gray-200 shadow-md shadow-gray-200 px-8 pt-8 pb-4">
                    <h2 className="text-2xl font-semibold text-center">
                      {section.title}
                    </h2>
                  </div>
                  <div className="p-8 flex flex-col gap-6">
                    {section.items?.map(
                      (
                        item: {
                          title: string;
                          content: string;
                          keywords?: string[];
                        },
                        sidx: number
                      ) => (
                        <div
                          key={item.title + "-" + sidx}
                          className="flex flex-col gap-1 border-b last:border-b-0 pb-6 last:pb-0"
                        >
                          <h3 className="text-lg font-bold text-primary mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-700 text-base leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            );
          }
          // Full-page style sections with image, no card bg, just clean section
          if (
            ["quality", "designs", "markets", "capacity"].includes(section.type)
          ) {
            // Fotoğrafı üstte göster: sadece quality ve capacity için
            const isTopImage =
              section.type === "quality" || section.type === "capacity";
            return (
              <section
                key={idx}
                className="mb-20 w-full flex justify-center border-t border-gray-200 pt-16"
              >
                <div className="w-full max-w-3xl flex flex-col items-center">
                  {section.image &&
                    section.image.trim() !== "" &&
                    isTopImage && (
                      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl mb-6">
                        <Image
                          src={section.image ?? ""}
                          alt={section.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 700px"
                          priority={idx === 0}
                        />
                      </div>
                    )}
                  <div className="w-full text-center md:text-left">
                    <h2 className="text-2xl font-semibold mb-3">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 text-base mb-2">
                      {section.content}
                    </div>
                  </div>
                  {section.image &&
                    section.image.trim() !== "" &&
                    !isTopImage && (
                      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl mt-6">
                        <Image
                          src={section.image ?? ""}
                          alt={section.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 700px"
                          priority={idx === 0}
                        />
                      </div>
                    )}
                </div>
              </section>
            );
          }
          if (section.type === "cta") {
            return (
              <section
                key={idx}
                className="mb-20 flex flex-col items-center justify-center border-t border-gray-200 pt-16"
              >
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  {section.title}
                </h2>
                <p className="mb-4 text-center text-gray-700 max-w-xl">
                  {section.content}
                </p>
                <a
                  href="https://wa.me/905321711494"
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
                    />
                  </span>
                  {section.cta}
                </a>
              </section>
            );
          }
          return null;
        })}
      </main>
    </>
  );
}
