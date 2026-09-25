"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function normalizeWhatsappUrl(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("92") ? digits.slice(0, 12) : digits.slice(0, 11);
  return normalized ? `https://wa.me/${normalized}` : "";
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [url, setUrl] = useState("");

  useEffect(() => {
    void fetch("/api/settings/shipping").then(async (response) => {
      if (response.ok) {
        const settings = await response.json() as { whatsappUrl?: string };
        setUrl(normalizeWhatsappUrl(settings.whatsappUrl ?? ""));
      }
    }).catch(() => undefined);
  }, []);

  if (!url || pathname.startsWith("/admin") || pathname.startsWith("/ruman-admin-hub")) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ruman Mart on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] flex h-14 w-14 animate-pulse items-center justify-center rounded-full border-2 border-[#19d5f2] bg-gradient-to-br from-[#123568] to-[#0b1d45] text-[#19d5f2] shadow-lg shadow-[#031a3b]/30 transition-transform hover:scale-110 hover:animate-none"
    >
      <span className="absolute inset-0 animate-ping rounded-full border border-[#19d5f2]/50" aria-hidden="true" />
      <MessageCircle size={27} strokeWidth={2.2} className="relative transition-transform duration-300 group-hover:rotate-[-8deg]" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#0b1d45] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">Welcome! How can we help?</span>
    </a>
  );
}
