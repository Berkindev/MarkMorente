import Image from "next/image";

const HREF =
  "https://wa.me/905321711494?text=" +
  encodeURIComponent(
    "Hello Mark Morente, I'm contacting you from your website and would like more information."
  );

export default function FloatingWhatsApp() {
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 hover:scale-110 transition-transform"
    >
      <Image src="/whatsapplogo.svg" alt="WhatsApp" width={30} height={30} unoptimized />
    </a>
  );
}
