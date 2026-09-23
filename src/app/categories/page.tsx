import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Home as HomeIcon,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryModel from "@/lib/models/Category";

export const metadata = {
  title: "Shop by Category",
  description: "Explore Ruman Mart categories including electronics, homeware, perfumes, watches and kitchen accessories.",
  alternates: { canonical: "/categories" },
};

type Category = {
  name: string;
  image: string;
  productCount: number;
  slug: string;
};

const allCategories: Category[] = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80", productCount: 152, slug: "electronics" },
  { name: "Homeware", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80", productCount: 98, slug: "homeware" },
  { name: "Kitchen Accessories", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80", productCount: 76, slug: "kitchen-accessories" },
  { name: "Style Gadgets", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&q=80", productCount: 64, slug: "style-gadgets" },
  { name: "Perfumes", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", productCount: 48, slug: "perfumes" },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80", productCount: 72, slug: "watches" },
  { name: "Wireless Earbuds", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80", productCount: 36, slug: "wireless-earbuds" },
  { name: "Smart Watches", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80", productCount: 59, slug: "smart-watches" },
  { name: "Air Fryer", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80", productCount: 31, slug: "air-fryer" },
  { name: "Comfort Bed Set", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80", productCount: 29, slug: "comfort-bed-set" },
  { name: "Men's Perfume", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", productCount: 45, slug: "mens-perfume" },
  { name: "Luxury Watch", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80", productCount: 34, slug: "luxury-watch" },
  { name: "Electronics Accessories", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80", productCount: 89, slug: "electronics-accessories" },
  { name: "Home Decor", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", productCount: 45, slug: "home-decor" },
  { name: "Fitness & Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", productCount: 27, slug: "fitness-sports" },
  { name: "Beauty & Personal Care", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80", productCount: 52, slug: "beauty-personal-care" },
  { name: "Office & School", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80", productCount: 33, slug: "office-school" },
  { name: "Toys & Games", image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80", productCount: 38, slug: "toys-games" },
  { name: "Automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", productCount: 22, slug: "automotive" },
  { name: "Groceries & Household", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", productCount: 41, slug: "groceries-household" },
];

const benefits = [
  { Icon: Truck, title: "Fast delivery", text: "Across Pakistan" },
  { Icon: ShoppingBag, title: "Curated products", text: "Picked for quality" },
  { Icon: Sparkles, title: "Great value", text: "Deals worth finding" },
];

export default async function CategoriesPage() {
  const databaseCategories = (await CategoryModel.findAll({ where: { isActive: true }, order: [["createdAt", "DESC"]], raw: true })) as unknown as Array<{ name: string; image: string; slug: string }>;
  const visibleCategories: Category[] = databaseCategories.map((category) => ({
    name: category.name,
    image: category.image,
    productCount: 0,
    slug: category.slug,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#f7fafc] text-slate-800">
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes cardShine {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        @keyframes badgePop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .anim-fade-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-blob-1 {
          animation: floatBlob 9s ease-in-out infinite;
        }
        .anim-blob-2 {
          animation: floatBlobSlow 11s ease-in-out infinite;
        }
        .anim-shimmer-text {
          background: linear-gradient(90deg, #19d5f2 0%, #ffffff 50%, #19d5f2 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }
        .anim-pulse-dot {
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        .cat-card {
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }
        .cat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #19c9ee, #0b75a5, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 2;
        }
        .cat-card:hover::before {
          opacity: 1;
        }
        .cat-card-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 100%
          );
          transform: translateX(-120%) skewX(-15deg);
          pointer-events: none;
          z-index: 3;
        }
        .cat-card:hover .cat-card-shine {
          animation: cardShine 0.9s ease forwards;
        }
        .cat-card-badge {
          animation: badgePop 0.3s ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up, .anim-blob-1, .anim-blob-2, .anim-shimmer-text,
          .anim-pulse-dot, .cat-card-shine {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-[#031a3b]">
          <div
            className="absolute inset-0 bg-[url('/mobile-hero.png')] bg-cover bg-center sm:hidden"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-[url('/hero.png')] bg-cover bg-center sm:block"
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

          <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-8 sm:min-h-[300px] md:min-h-[380px] md:px-8">
            {/* Breadcrumb - mobile par hidden */}
            <div
              className="anim-fade-up absolute inset-x-5 top-0 hidden items-center gap-1.5 py-4 text-sm text-slate-300 sm:flex md:inset-x-8"
              style={{ animationDelay: "0ms" }}
            >
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-white">
                <HomeIcon size={14} aria-hidden="true" />
                Home
              </Link>
              <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
              <span className="font-semibold text-white">Categories</span>
            </div>

            <div className="w-full min-w-0 max-w-xl text-white">
              <p
                className="anim-fade-up mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#19d5f2] sm:text-sm"
                style={{ animationDelay: "80ms" }}
              >
                <span className="anim-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#19d5f2]" aria-hidden="true" />
                Shop by Categories
              </p>

              <h1
                className="anim-fade-up max-w-full text-[1.55rem] font-bold leading-[1.08] sm:text-5xl"
                style={{ animationDelay: "180ms" }}
              >
                Explore Our
                <span className="anim-shimmer-text block">Product Categories</span>
              </h1>

              <p
                className="anim-fade-up mt-4 max-w-full text-sm leading-6 text-slate-200 sm:mt-5 sm:text-base"
                style={{ animationDelay: "300ms" }}
              >
                Find exactly what you need from our wide range of quality
                products. Shop smarter, live better!
              </p>
            </div>
          </div>
        </section>

  <section className="py-10 sm:py-14">
  <div className="mx-auto max-w-[1800px] px-4 md:px-8">
    <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <div
        className="anim-fade-up"
        style={{ animationDelay: "0ms" }}
      >
        <h2 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">
          Find what you need
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Explore our collections and discover your next favorite.
        </p>
      </div>

      <Link
        href="/"
        className="group anim-fade-up inline-flex items-center gap-1 text-sm font-semibold text-[#0b75a5] transition-colors hover:text-[#064d70]"
        style={{ animationDelay: "80ms" }}
      >
        Back to home

        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {(visibleCategories.length ? visibleCategories : allCategories).map((category, index) => (
        <Link
          key={category.name}
          href={`/categories/${category.slug}`}
          className="cat-card anim-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(11,29,69,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(11,117,165,0.28)]"
          style={{
            animationDelay: `${Math.min(index * 45, 500)}ms`,
          }}
        >
          {/* Shine sweep on hover */}
          <span
            className="cat-card-shine"
            aria-hidden="true"
          />

          {/* Image */}
          <div className="relative h-36 w-full overflow-hidden bg-white sm:h-40">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />

            {/* Bottom gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031a3b]/55 via-[#031a3b]/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Product count badge */}
            <span
              key={`badge-${category.name}`}
              className="cat-card-badge absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#0b1d45] shadow-sm backdrop-blur-sm"
            >
              {category.productCount} items
            </span>

            {/* Name overlay */}
            <div className="absolute inset-x-0 bottom-0 px-3.5 pb-2.5">
              <p className="truncate text-sm font-bold text-white drop-shadow-sm">
                {category.name}
              </p>
            </div>
          </div>

          {/* Footer row */}
          <div className="relative flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-500 transition-colors group-hover:text-[#0b75a5]">
                Shop now
              </p>
            </div>

            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6f7fc] text-[#0b75a5] transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#19c9ee] group-hover:to-[#0b75a5] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#19c9ee]/40">
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}