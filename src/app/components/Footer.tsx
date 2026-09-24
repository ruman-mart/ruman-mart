"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const customerService = [
  { label: "Help Center", href: "/help-center" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/share/1DfNAzWgrU/", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/ruman_mart?stkn=MWI3N3dyNjh1cXd1cA==", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@ruman.ali0304?_r=1&_t=ZS-99s0NKYzjev", Icon: TikTokIcon },
];

function FacebookIcon({ size = 16, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 8.5V6.8c0-.8.6-1.3 1.4-1.3H16V3h-2.5C11.6 3 10 4.6 10 7.2v1.3H8v2.9h2v7.6h3.5v-7.6h2.6l.4-2.9h-3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 16, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Footer() {
  const [site, setSite] = useState({ logoUrl: "/logo-web.webp", storeAddress: "hala, sindh, Pakistan", storePhone: "+92 304 1298136", storeEmail: "rumanshakee56@gmail.com", facebookUrl: "https://www.facebook.com/share/1DfNAzWgrU/", instagramUrl: "https://www.instagram.com/ruman_mart", tiktokUrl: "https://www.tiktok.com/@ruman.ali0304", whatsappUrl: "" });
  useEffect(() => { void fetch("/api/settings/shipping").then(async (response) => { if (response.ok) { const settings = await response.json(); setSite((current) => ({ ...current, ...settings })); } }).catch(() => undefined); }, []);
  const dynamicSocials = socials.map((social) => ({ ...social, href: social.label === "Facebook" ? site.facebookUrl : social.label === "Instagram" ? site.instagramUrl : site.tiktokUrl })).filter((social) => social.href);
  return (
    <footer className="w-full border-t-2 border-[#1fb6e6] bg-[radial-gradient(circle_at_top,#173d7a_0%,#001B42_55%,#00132f_100%)] text-white shadow-[0_-2px_12px_rgba(0,0,0,0.12)]">
      <div className="mx-auto max-w-[1800px] px-4 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr_0.9fr]">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="mt-6 flex items-center gap-2">
              <Image
                src={site.logoUrl}
                alt="Ruman Mart logo"
                width={220}
                height={120}
                className="h-[88px] w-auto object-contain md:h-[110px]"
              />
            </Link>
            <p className=" pl-1 text-md font-medium italic tracking-[0.04em] text-slate-300">
              Shop Smart, Live Better
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#1fb6e6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Customer Service
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {customerService.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#1fb6e6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Get In Touch
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-[#1fb6e6]" />
                <a
                  href={`tel:${site.storePhone}`}
                  className="transition-colors hover:text-[#1fb6e6]"
                >
                  {site.storePhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-[#1fb6e6]" />
                <a
                  href={`mailto:${site.storeEmail}`}
                  className="transition-colors hover:text-[#1fb6e6]"
                >
                  {site.storeEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-[#1fb6e6]" />
                <span>{site.storeAddress}</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
              Follow Us
            </h3>
            <div className="flex items-center gap-3">
              {dynamicSocials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-[#1fb6e6] hover:bg-[#1fb6e6]/10 hover:text-[#1fb6e6]"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/15 pt-4">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Ruman Mart. All rights reserved.
            </p>
            <p className="font-serif text-sm italic text-slate-300">
              Shop Smart, Live Better
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}