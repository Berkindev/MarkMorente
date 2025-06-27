"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-center max-w-md">
        Sorry, the page you are looking for could not be found or may have been
        removed.
        <br />
        <span className="text-sm text-gray-500">
          You will be redirected to the homepage in 3 seconds.
        </span>
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold shadow hover:bg-primary/90 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
