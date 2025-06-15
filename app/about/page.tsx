import Navbar from "@/components/Navbar";
import aboutData from "@/aboutus.json";
import Image from "next/image";

export const metadata = {
  title: "About Us - MarkMorente Suits",
  description: aboutData.hero_description,
};

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* HERO */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            {aboutData.hero_description}
          </p>
        </section>
        {/* INTRO */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
          <p className="text-base md:text-lg text-gray-800 mb-2">
            {aboutData.intro_paragraph}
          </p>
          <p className="text-base text-gray-700">{aboutData.story}</p>
        </section>
        {/* SPECS */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-2">Production Specs</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                Production Capacity: {aboutData.specs.production_capacity}
              </li>
              <li>MOQ: {aboutData.specs.moq}</li>
              <li>Delivery: {aboutData.specs.delivery}</li>
              <li>Customization: {aboutData.specs.customization}</li>
              <li>Technology: {aboutData.specs.technology}</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <h3 className="font-bold text-lg mb-2">Target Clients</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {aboutData.target_clients.map((client: string) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </div>
        </section>
        {/* WHY US */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Why Choose Us?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutData.why_us.map((reason: string) => (
              <li
                key={reason}
                className="bg-primary/5 rounded-lg p-4 text-gray-800 font-medium"
              >
                {reason}
              </li>
            ))}
          </ul>
        </section>
        {/* CERTIFICATIONS & CLIENTS */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2">Certifications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {aboutData.certifications.map((cert: string) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-2">Clients</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {aboutData.clients.map((client: string) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </div>
        </section>
        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {aboutData.faq.map(
              (item: { q: string; a: string }, idx: number) => (
                <div key={item.q} className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-semibold mb-1">{item.q}</h4>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </>
  );
}
