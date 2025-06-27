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
      <h2 className="text-2xl font-semibold mb-2">Sayfa Bulunamadı</h2>
      <p className="mb-6 text-center max-w-md">
        Üzgünüz, aradığınız sayfa bulunamadı veya kaldırılmış olabilir.
        <br />
        <span className="text-sm text-gray-500">
          3 saniye içinde ana sayfaya yönlendirileceksiniz.
        </span>
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold shadow hover:bg-primary/90 transition"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
