import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Tag,
  Truck,
  Headset,
  Users,
  CheckCircle2,
  FileText,
  Lock,
  MessageCircle,
  MapPin,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShippingSettings from "@/lib/models/ShippingSettings";

export const metadata = {
  title: "About Ruman Mart",
  description: "Learn about Ruman Mart, your trusted online store for quality products and reliable delivery across Pakistan.",
  alternates: { canonical: "/about" },
};

type WebsiteProfile = {
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  aboutStoryTitle: string;
  aboutStoryText: string;
  aboutStorySecondText: string;
  aboutStoryImage: string;
};

const defaultProfile: WebsiteProfile = {
  storeAddress: "Shakeel Shopping Centre, Tariq Road",
  storePhone: "+92 304 1298136",
  storeEmail: "rumanshakee56@gmail.com",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  whatsappUrl: "https://wa.me/923041298136?text=Hello%20Ruman%20Mart",
  aboutStoryTitle: "Built with Passion, For Your Convenience",
  aboutStoryText: "Ruman Mart began with a simple idea: to put quality products within reach of every home at a fair price. Starting in Hala, we have grown from a single store into a presence across Instagram, TikTok, Facebook, WhatsApp, and our flagship store at Shakeel Shopping Centre, Tariq Road.",
  aboutStorySecondText: "Today we proudly serve customers across Pakistan with a wide and growing range of products.",
  aboutStoryImage: "/about.webp",
};

async function getWebsiteProfile(): Promise<WebsiteProfile> {
  try {
    const settings = await ShippingSettings.findByPk(1, { raw: true }) as unknown as Partial<WebsiteProfile> | null;
    return {
      storeAddress: String(settings?.storeAddress || defaultProfile.storeAddress),
      storePhone: String(settings?.storePhone || defaultProfile.storePhone),
      storeEmail: String(settings?.storeEmail || defaultProfile.storeEmail),
      facebookUrl: String(settings?.facebookUrl || ""),
      instagramUrl: String(settings?.instagramUrl || ""),
      tiktokUrl: String(settings?.tiktokUrl || ""),
      whatsappUrl: String(settings?.whatsappUrl || defaultProfile.whatsappUrl),
      aboutStoryTitle: String(settings?.aboutStoryTitle || defaultProfile.aboutStoryTitle),
      aboutStoryText: String(settings?.aboutStoryText || defaultProfile.aboutStoryText),
      aboutStorySecondText: String(settings?.aboutStorySecondText || defaultProfile.aboutStorySecondText),
      aboutStoryImage: String(settings?.aboutStoryImage || defaultProfile.aboutStoryImage),
    };
  } catch {
    return defaultProfile;
  }
}

const whyChooseUs: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: ShieldCheck,
    title: "100% Original Products",
    text: "Every item is carefully selected so that only genuine, quality products reach your doorstep.",
  },
  {
    Icon: Tag,
    title: "Affordable Rates",
    text: "Great quality without stretching your budget.",
  },
  {
    Icon: Truck,
    title: "Fast & Reliable Delivery",
    text: "Quick, safe delivery nationwide, with Cash on Delivery available.",
  },
  {
    Icon: Headset,
    title: "Responsive Customer Support",
    text: "Our team is available on WhatsApp and social media to help you at every step.",
  },
  {
    Icon: Users,
    title: "Reseller Program",
    text: "Want to start your own business? Join the Ruman Mart reseller program and grow with us.",
  },
];

const commitments = [
  { Icon: CheckCircle2, text: "Offering only genuine and authentic products" },
  { Icon: FileText, text: "Providing clear, accurate product descriptions" },
  { Icon: Lock, text: "Protecting the privacy and security of your orders and data" },
  { Icon: Headset, text: "Taking every piece of customer feedback seriously" },
];

export default async function AboutPage() {
  const profile = await getWebsiteProfile();
  const socialLinks = [
    { Icon: MessageCircle, label: "WhatsApp", href: profile.whatsappUrl },
    { Icon: MessageCircle, label: "Instagram", href: profile.instagramUrl },
    { Icon: MessageCircle, label: "Facebook", href: profile.facebookUrl },
  ].filter((link) => link.href);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] font-sans text-slate-800">
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
  <div
    className="absolute inset-0 bg-[#031a3b]/50"
    aria-hidden="true"
  />

  <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-7 sm:min-h-[280px] md:min-h-[340px] md:px-8 lg:min-h-[380px]">
    <div className="max-w-xl text-white">

      {/* Breadcrumb - mobile par hidden */}
      <div className="mb-4 hidden items-center gap-1.5 text-xs text-slate-300 sm:flex">
        <Link href="/" className="flex items-center gap-1 hover:text-white">
          <HomeIcon size={12} aria-hidden="true" />
          Home
        </Link>

        <ChevronRight size={12} aria-hidden="true" />

        <span className="text-slate-100">About Us</span>
      </div>

      <h1 className="text-[1.55rem] font-bold leading-none tracking-tight sm:text-4xl lg:text-5xl">
        About <span className="text-[#19d5f2]">Us</span>
      </h1>

      <h2 className="mt-2 text-base font-semibold text-white sm:text-lg">
        Original Products. Affordable Rates.
      </h2>

      <p className="mt-3 max-w-lg text-xs leading-5 text-slate-200 sm:text-sm">
        At Ruman Mart, we believe in making your life easier with the
        best products, great prices and a seamless shopping experience
        - all in one place.
      </p>

    </div>
  </div>
</section>

        {/* Welcome */}
        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">
                Welcome to Ruman Mart
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-[#0b1d45] sm:text-3xl">
                Your Trusted Destination for
                <span className="block text-[#19d5f2]">
                  Everyday Essentials & Lifestyle Gadgets
                </span>
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Ruman Mart is your trusted destination for household
                essentials, lifestyle gadgets, and everyday products,
                available online and in store. Our mission is simple: to
                bring you original products at affordable rates, and to make
                shopping easy, secure, and worry-free.
              </p>
            </div>
          </div>
        </section>

      {/* Our Story */}
<section className="bg-[#f5f7fb] py-10 sm:py-14">
  <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-12">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">
        Our Story
      </p>

      <h2 className="mt-2 text-2xl font-bold leading-tight text-[#0b1d45] sm:text-3xl">
        {profile.aboutStoryTitle}
      </h2>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {profile.aboutStoryText}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {profile.aboutStorySecondText}
      </p>
    </div>

    <div className="relative overflow-hidden rounded-2xl bg-[#0b1d45] shadow-lg">
      <img
        src={profile.aboutStoryImage}
        alt="Ruman Mart workspace and products"
        className="h-auto w-full object-contain"
      />
    </div>
  </div>
</section>

        {/* Why Choose Us */}
        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">
                Why Choose Ruman Mart?
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#0b1d45] sm:text-3xl">
                More Than <span className="text-[#19d5f2]">Just a Store</span>
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {whyChooseUs.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f7fb] p-4 text-center shadow-sm sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e6f7fc] text-[#0b75a5]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <p className="text-sm font-bold text-[#0b1d45]">{title}</p>
                  <p className="text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="bg-[#0b1d45] py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#19d5f2]">
                Our Vision
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Where We&apos;re Headed
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                We aim to become one of Pakistan&apos;s leading online
                shopping brands, offering a smooth and dependable experience
                to every customer. As we expand our product range, we will
                keep the same standards of quality and service that our
                customers trust.
              </p>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="bg-[#f5f7fb] py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">
              Our Commitment
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#0b1d45] sm:text-3xl">
              Standards We Never Compromise On
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {commitments.map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f7fc] text-[#0b75a5]">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-5 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect With Us */}
        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="grid grid-cols-1 gap-8 rounded-2xl bg-gradient-to-r from-[#031a3b] to-[#0b1d45] p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#19d5f2]">
                  Connect With Us
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Let&apos;s Stay in Touch
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                  Follow us on Instagram, TikTok, and Facebook for new
                  arrivals and special offers, or message us directly on
                  WhatsApp. You are also welcome to visit our store at Shakeel
                  Shopping Centre, Tariq Road. Your feedback matters to us.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {socialLinks.map(({ Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#19c9ee] hover:text-white"
                      aria-label={label}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </Link>
                  ))}
                  <Link
                    href={profile.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#19c9ee] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0db4d8]"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Message on WhatsApp
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-xl bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-[#19d5f2]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-white">Visit Our Store</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {profile.storeAddress}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{profile.storePhone}</p>
                    <p className="text-xs text-slate-400">{profile.storeEmail}</p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="mt-2 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#19d5f2] hover:text-[#5be3fa]"
                >
                  Start Shopping <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}