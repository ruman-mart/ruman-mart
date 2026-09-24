"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  User,
  Tag,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STORE_ADDRESS = "RC7C+294 Shakeel General Store, Misri St, Hala, Pakistan";

const contactInfo: {
  Icon: LucideIcon;
  title: string;
  lines: string[];
}[] = [
  {
    Icon: Phone,
    title: "Phone",
    lines: ["+92 304 1298136", "Mon - Sat, 9:00 AM - 6:00 PM"],
  },
  {
    Icon: Mail,
    title: "Email",
    lines: ["rumanshakee56@gmail.com", "We reply within 24 hours"],
  },
  {
    Icon: MapPin,
    title: "Our Address",
    lines: [STORE_ADDRESS],
  },
];

const subjects = [
  "General Inquiry",
  "Order Support",
  "Returns & Refunds",
  "Reseller Program",
  "Feedback",
];

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [site, setSite] = useState({ storeAddress: STORE_ADDRESS, storePhone: "+92 304 1298136", storeEmail: "rumanshakee56@gmail.com", whatsappUrl: "https://wa.me/923041298136?text=Hello%20Ruman%20Mart" });
  useEffect(() => {
    void fetch("/api/settings/shipping")
      .then(async (response) => {
        if (response.ok) {
          const settings = await response.json();
          setSite((current) => ({ ...current, ...settings }));
        }
      })
      .catch(() => undefined);
  }, []);
  const dynamicContactInfo = [
    { Icon: Phone, title: "Phone", lines: [site.storePhone, "Mon - Sat, 9:00 AM - 6:00 PM"] },
    { Icon: Mail, title: "Email", lines: [site.storeEmail, "We reply within 24 hours"] },
    { Icon: MapPin, title: "Our Address", lines: [site.storeAddress] },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const saveResponse = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, subject: selectedSubject, message }),
    });
    if (!saveResponse.ok) {
      const result = await saveResponse.json().catch(() => ({})) as { message?: string };
      setFormMessage(result.message ?? "Unable to send inquiry.");
      setSubmitting(false);
      return;
    }
    form.reset();
    setSelectedSubject("");
    setFormMessage("");
    setSuccessOpen(true);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] font-sans text-slate-800">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -25px) scale(1.08); }
        }
        @keyframes floatBlobSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 20px) scale(1.05); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .anim-fade-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-blob-1 { animation: floatBlob 9s ease-in-out infinite; }
        .anim-blob-2 { animation: floatBlobSlow 11s ease-in-out infinite; }
        .anim-pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }

        .contact-card {
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -8px rgba(11, 117, 165, 0.18);
          border-color: #19c9ee;
        }

        .contact-input:focus-within svg {
          color: #0b75a5;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up, .anim-blob-1, .anim-blob-2, .anim-pulse-dot {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .contact-card:hover { transform: none; }
        }
      `}</style>

      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#031a3b]">
          <div
            className="absolute inset-0 bg-[url('/mobile-hero.webp')] bg-cover bg-center sm:hidden"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-[url('/hero.webp')] bg-cover bg-center sm:block"
            aria-hidden="true"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#031a3b]/50" aria-hidden="true" />

          {/* Floating gradient blobs */}
          <div
            className="anim-blob-1 pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#19c9ee]/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="anim-blob-2 pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-[#0b75a5]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-7 sm:min-h-[280px] md:min-h-[340px] md:px-8 lg:min-h-[380px]">
            <div className="max-w-xl text-white">
              {/* Breadcrumb - mobile par hidden */}
              <div
                className="anim-fade-up mb-4 hidden items-center gap-1.5 text-xs text-slate-300 sm:flex"
                style={{ animationDelay: "0ms" }}
              >
                <Link href="/" className="flex items-center gap-1 hover:text-white">
                  <HomeIcon size={12} aria-hidden="true" />
                  Home
                </Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="text-slate-100">Contact Us</span>
              </div>

              <h1
                className="anim-fade-up text-[1.55rem] font-bold leading-none tracking-tight sm:text-4xl lg:text-5xl"
                style={{ animationDelay: "80ms" }}
              >
                Contact <span className="text-[#19d5f2]">Us</span>
              </h1>

              <h2
                className="anim-fade-up mt-2 flex items-center gap-2 text-base font-semibold text-white sm:text-lg"
                style={{ animationDelay: "180ms" }}
              >
                <span className="anim-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#19d5f2]" aria-hidden="true" />
                We&apos;re Here to Help You
              </h2>

              <p
                className="anim-fade-up mt-3 max-w-lg text-xs leading-5 text-slate-200 sm:text-sm"
                style={{ animationDelay: "280ms" }}
              >
                Have a question or need assistance? Reach out to the Ruman Mart
                team and we&apos;ll be happy to help.
              </p>

              <div
                className="anim-fade-up mt-5 flex flex-wrap gap-4 text-xs text-slate-200 sm:text-sm"
                style={{ animationDelay: "380ms" }}
              >
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-[#19d5f2]" aria-hidden="true" />
                  Call us
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-[#19d5f2]" aria-hidden="true" />
                  Email us
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#19d5f2]" aria-hidden="true" />
                  Visit our store
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1800px] px-4 py-10 md:px-8">
          {/* Form + contact info */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Send Us a Message */}
            <div
              className="contact-card anim-fade-up rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              style={{ animationDelay: "0ms" }}
            >
              <h2 className="text-xl font-bold text-[#0b1d45] sm:text-2xl">
                Send Us <span className="text-[#19d5f2]">a Message</span>
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="contact-input relative">
                    <User
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                      aria-hidden="true"
                    />
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Your Name *"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm transition-shadow focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                  <div className="contact-input relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                      aria-hidden="true"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email *"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm transition-shadow focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                </div>

                <div className="contact-input relative">
                  <Phone
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                    aria-hidden="true"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm transition-shadow focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                  />
                </div>

                <div className="contact-input relative">
                  <Tag
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                    aria-hidden="true"
                  />
                  <select
                    required
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-8 text-sm text-slate-700 transition-shadow focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                  >
                    <option value="" disabled>
                      Select Subject *
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
                    aria-hidden="true"
                  />
                </div>

                <div className="contact-input relative">
                  <MessageSquare
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400 transition-colors"
                    aria-hidden="true"
                  />
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Your Message *"
                    className="w-full resize-none rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm transition-shadow focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#19c9ee] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0db4d8] hover:shadow-lg hover:shadow-[#19c9ee]/30 disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Message"}
                  {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
                </button>
                {formMessage && <p className="text-sm font-medium text-rose-600">{formMessage}</p>}
              </form>
            </div>

            {/* Contact info sidebar */}
            <div className="flex flex-col gap-4">
              {dynamicContactInfo.map(({ Icon, title, lines }, index) => (
                <div
                  key={title}
                  className="contact-card anim-fade-up flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f7fc] text-[#0b75a5]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0b1d45]">{title}</p>
                    {lines.map((line) => (
                      <p key={line} className="mt-0.5 text-xs text-slate-500">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <div
                className="contact-card anim-fade-up flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                style={{ animationDelay: `${dynamicContactInfo.length * 80}ms` }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <MessageCircle size={18} aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#0b1d45]">Live Chat</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Chat with us on WhatsApp. Quick support, anytime.
                    </p>
                  </div>
                  <Link
                    href={site.whatsappUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/30"
                  >
                    Chat Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Find Us On Map */}
          <div
            className="anim-fade-up mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            style={{ animationDelay: "0ms" }}
          >
            <h2 className="text-xl font-bold text-[#0b1d45] sm:text-2xl">
              Find Us <span className="text-[#19d5f2]">On Map</span>
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Visit our office or get in touch with us at our location.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
              {/* Map embed */}
              <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 sm:h-80">
                <iframe
                  title="Ruman Mart location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(site.storeAddress)}&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Visit our store card */}
              <div className="contact-card flex flex-col items-center justify-center gap-3 rounded-xl bg-[#f5f7fb] p-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7fc] text-[#0b75a5]">
                  <MapPin size={28} aria-hidden="true" />
                </span>
                <p className="text-base font-bold text-[#0b1d45]">
                  Visit Our Store
                </p>
                <p className="text-sm leading-6 text-slate-500">
                  {site.storeAddress}
                </p>
                <p className="text-xs text-slate-400">
                  You can also visit our physical store for a better shopping
                  experience. Our team is always happy to help!
                </p>
                <Link
                  href={`https://www.google.com/maps?q=${encodeURIComponent(site.storeAddress)}`}
                  target="_blank"
                  className="group mt-1 inline-flex items-center gap-2 rounded-lg border-2 border-[#19c9ee] px-5 py-2.5 text-sm font-semibold text-[#0b75a5] transition-all duration-300 hover:bg-[#e6f7fc] hover:shadow-md"
                >
                  <Navigation
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  Get Directions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {successOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#031a3b]/55 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="inquiry-success-title" className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/60 bg-white p-7 text-center shadow-2xl shadow-[#031a3b]/30">
            <button type="button" aria-label="Close success message" onClick={() => setSuccessOpen(false)} className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
              <span className="text-xl leading-none">&times;</span>
            </button>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
              <CheckCircle2 size={38} strokeWidth={2.2} />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#0b75a5]">Message received</p>
            <h2 id="inquiry-success-title" className="mt-2 text-2xl font-bold text-[#0b1d45]">Thank you for contacting us</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your inquiry has been sent successfully. Our team will get back to you soon.</p>
            <button type="button" onClick={() => setSuccessOpen(false)} className="mt-6 w-full rounded-lg bg-[#0b1d45] py-3 text-sm font-bold text-white transition-colors hover:bg-[#102d62]">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}