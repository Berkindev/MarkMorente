import Navbar from "@/components/Navbar";
import contactDataJson from "@/contactus.json";
import Image from "next/image";

const contactData = contactDataJson as {
  title: string;
  hero_description: string;
  contact_channels: {
    platform: string;
    url: string;
    logo: string;
    description: string;
    color: string;
  }[];
  about_snippet: { title: string; text: string };
  highlights: string[];
  footer: string;
};

export const metadata = {
  title: "Contact - MarkMorente Suits",
  description: contactData.hero_description,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="container mx-auto max-w-2xl py-12 px-4 flex flex-col gap-10 items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          {contactData.title}
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-6">
          {contactData.hero_description}
        </p>
        {/* Contact Channels */}
        <div className="flex flex-col gap-4 w-full mb-8">
          {contactData.contact_channels.map((ch) => (
            <a
              key={ch.platform}
              href={ch.url}
              target="_blank"
              rel="noopener"
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold shadow hover:scale-105 transition-transform bg-white dark:bg-zinc-900 border border-gray-200 hover:bg-gray-50 text-lg ${
                ch.color === "green"
                  ? "border-green-500 text-green-600"
                  : ch.color === "blue"
                  ? "border-blue-400 text-blue-500"
                  : ch.color === "pink"
                  ? "border-pink-400 text-pink-500"
                  : ""
              }`}
            >
              {ch.logo === "icon" ? (
                <svg
                  width="28"
                  height="28"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm6 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z" />
                </svg>
              ) : (
                <Image
                  src={ch.logo}
                  alt={ch.platform + " logo"}
                  width={28}
                  height={28}
                  unoptimized
                />
              )}
              <span>{ch.platform}</span>
              <span className="ml-auto text-sm text-gray-500 font-normal">
                {ch.description}
              </span>
            </a>
          ))}
        </div>
        {/* Highlights */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {contactData.highlights.map((h) => (
            <span
              key={h}
              className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              {h}
            </span>
          ))}
        </div>
        {/* About Snippet */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">
            {contactData.about_snippet.title}
          </h2>
          <p className="text-base text-muted-foreground">
            {contactData.about_snippet.text}
          </p>
        </div>
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          {contactData.footer}
        </footer>
      </section>
    </main>
  );
}
