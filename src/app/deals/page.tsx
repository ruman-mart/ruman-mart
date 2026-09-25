import Link from "next/link";
import { ArrowRight, ChevronRight, Home as HomeIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistButton from "../components/WishlistButton";
import ProductModel from "@/lib/models/Product";

export const metadata = {
  title: "Deals and Discounts",
  description: "Save more with the latest deals and discounts on quality products at Ruman Mart.",
  alternates: { canonical: "/deals" },
};

type Deal = {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  categorySlug?: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  let landingDeals: Deal[] = [];
  try {
    const databaseDeals = (await ProductModel.findAll({ where: { isActive: true, isDeal: true }, include: [{ association: "category", attributes: ["slug"] }], order: [["createdAt", "DESC"]], raw: true, nest: true })) as unknown as Array<{ name: string; brand: string; price: number; originalPrice: number; rating: number | string; reviews: number; image: string; category?: { slug: string } }>;
    landingDeals = databaseDeals.map((deal) => ({ name: deal.name, brand: deal.brand, price: deal.price, originalPrice: deal.originalPrice, discount: Math.max(0, Math.round((1 - deal.price / deal.originalPrice) * 100)), rating: Number(deal.rating), reviews: deal.reviews, image: deal.image, categorySlug: deal.category?.slug }));
  } catch (error) {
    console.error("Deals could not load:", error);
  }
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(landingDeals.length / pageSize));
  const requestedPage = Number.parseInt((await searchParams).page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const visibleDeals = landingDeals.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageNumbers = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])).filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
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
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
        }

        .anim-fade-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-blob-1 { animation: floatBlob 9s ease-in-out infinite; }
        .anim-blob-2 { animation: floatBlobSlow 11s ease-in-out infinite; }
        .anim-shimmer-text {
          background: linear-gradient(90deg, #19d5f2 0%, #ffffff 50%, #19d5f2 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }
        .anim-pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }

        .deal-card {
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }
        .deal-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #f43f5e, #0b75a5, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 2;
        }
        .deal-card:hover::before { opacity: 1; }
        .deal-card-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
          transform: translateX(-120%) skewX(-15deg);
          pointer-events: none;
          z-index: 3;
        }
        .deal-card:hover .deal-card-shine {
          animation: cardShine 0.9s ease forwards;
        }
        .deal-card-badge {
          animation: badgePop 0.3s ease forwards, pulseGlow 2s ease-in-out infinite 0.3s;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up, .anim-blob-1, .anim-blob-2, .anim-shimmer-text,
          .anim-pulse-dot, .deal-card-shine, .deal-card-badge {
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
            className="absolute inset-0 bg-[url('/mobile-hero.webp')] bg-cover bg-center sm:hidden"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-[url('/hero.webp')] bg-cover bg-center sm:block"
            aria-hidden="true"
          />
          {/* Dark Blue Overlay */}
          <div className="absolute inset-0 bg-[#031a3b]/50" aria-hidden="true" />

          {/* Floating gradient blobs */}
          <div
            className="anim-blob-1 pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="anim-blob-2 pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-[#0b75a5]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-7 sm:min-h-[280px] md:min-h-[340px] md:px-8 lg:min-h-[380px]">
            <div className="max-w-2xl text-white">
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
                <span className="text-slate-100">Deals</span>
              </div>

              <p
                className="anim-fade-up flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#19d5f2] sm:text-sm"
                style={{ animationDelay: "80ms" }}
              >
                <span className="anim-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#19d5f2]" aria-hidden="true" />
                Limited-time savings
              </p>

              <h1
                className="anim-fade-up mt-2 text-[1.55rem] font-bold leading-[1.05] sm:text-5xl"
                style={{ animationDelay: "180ms" }}
              >
                Hot <span className="anim-shimmer-text">Deals</span>
              </h1>

              <p
                className="anim-fade-up mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base"
                style={{ animationDelay: "300ms" }}
              >
                Find better prices on customer-favorite products before the offers end.
              </p>
            </div>
          </div>
        </section>

      <section className="mx-auto max-w-[1800px] px-4 py-10 sm:py-14 md:px-8">
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
    <div className="anim-fade-up" style={{ animationDelay: "0ms" }}>
      <h2 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">
        Today&apos;s Best Deals
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Save more on popular picks.
      </p>
    </div>

    <Link
      href="/categories"
      className="group anim-fade-up inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#0b75a5] transition-colors hover:text-[#064d70]"
      style={{ animationDelay: "80ms" }}
    >
      Shop Categories

      <ChevronRight
        size={15}
        className="transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  </div>

  {landingDeals.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h3 className="text-lg font-bold text-[#0b1d45]">No deals available right now</h3><p className="mt-2 text-sm text-slate-500">New offers will appear here when products are marked as deals.</p></div>}

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {visibleDeals.map((deal) => (
      <article
        key={deal.name}
        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        {/* Product Image */}
        <div className="relative flex h-40 items-center justify-center bg-white px-4 pt-4">
          <WishlistButton product={deal} />

          <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[11px] font-bold text-white">
            -{deal.discount}%
          </span>

          <img
            src={deal.image}
            alt={deal.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
          <h3 className="truncate text-sm font-bold text-[#0b1d45]">
            {deal.name}
          </h3>
          <p className="text-xs text-slate-500">{deal.brand}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#0b1d45]">
              {formatPrice(deal.price)}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(deal.originalPrice)}
            </span>
          </div>

          <Link
            href={`/categories/${deal.categorySlug ?? "electronics"}/${slugify(deal.name)}`}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle_at_top,#2b5b9a_0%,#0b3268_55%,#06234d_100%)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Product
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    ))}
  </div>
  {totalPages > 1 && <nav aria-label="Deals pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
    <Link href={`/deals?page=${Math.max(1, currentPage - 1)}`} aria-label="Previous deals page" className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white ${currentPage === 1 ? "pointer-events-none text-slate-300" : "text-slate-500 hover:bg-slate-50"}`}><ChevronRight size={16} className="rotate-180" aria-hidden="true" /></Link>
    {pageNumbers.map((page, index) => <span key={page} className="flex items-center gap-1.5">{index > 0 && page - pageNumbers[index - 1] > 1 && <span className="px-1 text-sm text-slate-400">...</span>}<Link href={`/deals?page=${page}`} className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${page === currentPage ? "bg-[#19c9ee] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{page}</Link></span>)}
    <Link href={`/deals?page=${Math.min(totalPages, currentPage + 1)}`} aria-label="Next deals page" className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white ${currentPage === totalPages ? "pointer-events-none text-slate-300" : "text-slate-500 hover:bg-slate-50"}`}><ChevronRight size={16} aria-hidden="true" /></Link>
  </nav>}
</section>
      </main>
      <Footer />
    </div>
  );
}