"use client";

import {
  Phone,
  Watch,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Headphones,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORE_NAME = "Ruman Mart";
const DEFAULT_PHONE_DISPLAY = "+92 304 1298136";

// Products ke icons: watches, electronics, perfumes, kitchen, gadgets
const ICONS = [Watch, Smartphone, Sparkles, UtensilsCrossed, Headphones];

// Ek group ki width screen se zyada honi chahiye taake loop mein gap na aaye
const REPEAT = 5;

const fade =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Group({ hidden = false, phoneDisplay }: { hidden?: boolean; phoneDisplay: string }) {
  const phoneHref = getPhoneHref(phoneDisplay);

  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? true : undefined}
    >
      {Array.from({ length: REPEAT }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <li key={i} className="flex items-center whitespace-nowrap">
            {/* Brand */}
            <span className="bg-gradient-to-r from-white via-white to-[#7deaff] bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-2xl">
              {STORE_NAME}
            </span>

            {/* Separator icon */}
            <span
              className="mx-4 grid h-8 w-8 place-items-center rounded-full border border-[#19d5f2]/40 bg-[#19d5f2]/10 text-[#19d5f2] shadow-[0_0_14px_rgba(25,213,242,0.35)] sm:mx-6 sm:h-9 sm:w-9"
              aria-hidden="true"
            >
              <Icon size={16} />
            </span>

            {/* Phone pill */}
            <a
              href={phoneHref}
              tabIndex={hidden ? -1 : undefined}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#19c9ee] to-[#6fe6f9] py-1 pl-1 pr-5 text-sm font-bold text-[#031a3b] shadow-lg shadow-cyan-500/30 ring-1 ring-white/30 transition-transform hover:scale-[1.03] sm:text-lg"
            >
              <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[#031a3b] text-[#19d5f2] sm:h-8 sm:w-8">
                <span
                  className="absolute inset-0 rounded-full bg-[#031a3b]/70 motion-safe:animate-ping"
                  aria-hidden="true"
                />
                <Phone size={14} className="relative" aria-hidden="true" />
              </span>
              {phoneDisplay}
            </a>

            {/* Separator icon (next item se pehle) */}
            <span
              className="mx-4 h-1.5 w-1.5 rotate-45 bg-[#19d5f2] shadow-[0_0_10px_2px_rgba(25,213,242,0.6)] sm:mx-6"
              aria-hidden="true"
            />
          </li>
        );
      })}
    </ul>
  );
}

export default function MarqueeStrip() {
  const [phoneDisplay, setPhoneDisplay] = useState(DEFAULT_PHONE_DISPLAY);

  useEffect(() => {
    void fetch("/api/settings/shipping")
      .then(async (response) => {
        if (!response.ok) return;
        const settings = (await response.json()) as { storePhone?: string };
        if (settings.storePhone) {
          setPhoneDisplay(settings.storePhone);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <section
      aria-label={`${STORE_NAME} contact`}
      className="relative overflow-hidden bg-[#021126] py-4 sm:py-5"
    >
      {/* soft cyan glow behind the strip */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_50%_0%,rgba(25,213,242,0.22),transparent_70%)]"
        aria-hidden="true"
      />

      {/* top + bottom glow lines */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19d5f2] to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#19d5f2]/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative" style={{ maskImage: fade, WebkitMaskImage: fade }}>
        <div className="ruman-marquee flex w-max items-center">
          <Group phoneDisplay={phoneDisplay} />
          <Group hidden phoneDisplay={phoneDisplay} />
        </div>
      </div>

      <style>{`
        @keyframes ruman-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ruman-marquee {
          animation: ruman-marquee 38s linear infinite;
        }
        .ruman-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ruman-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}