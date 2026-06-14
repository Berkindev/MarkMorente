import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-foreground px-4 py-16">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-8 text-center max-w-md text-gray-600">
          Sorry, the page you are looking for could not be found or may have
          been moved. Explore our suit and tuxedo collections instead.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold shadow hover:bg-primary/90 transition"
          >
            Go to Homepage
          </Link>
          <Link
            href="/collections"
            className="inline-block px-6 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition"
          >
            Browse Collections
          </Link>
          <Link
            href="/mens-suit-manufacturing"
            className="inline-block px-6 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition"
          >
            Manufacturing
          </Link>
        </div>
      </div>
    </>
  );
}
