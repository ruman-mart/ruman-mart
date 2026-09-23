import Link from "next/link";
import { ChevronRight, Home as HomeIcon, ShoppingCart, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistButton from "../components/WishlistButton";
import ProductModel from "@/lib/models/Product";

export const metadata = {
  title: "New Arrivals",
  description: "Discover the newest products and latest arrivals added to Ruman Mart.",
  alternates: { canonical: "/new-arrivals" },
};

type Product = {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  categorySlug?: string;
};

function productSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={12}
          className={index < Math.round(rating) ? "fill-[#f5a623] text-[#f5a623]" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
}

export default async function NewArrivalsPage() {
  const databaseProducts = (await ProductModel.findAll({ where: { isActive: true, isNewArrival: true }, include: [{ association: "category", attributes: ["slug"] }], order: [["createdAt", "DESC"]], raw: true, nest: true })) as unknown as Array<{ name: string; brand: string; price: number; originalPrice: number; rating: number | string; reviews: number; image: string; category?: { slug: string } }>;
  const products: Product[] = databaseProducts.map((product) => ({ name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, rating: Number(product.rating), reviews: product.reviews, image: product.image, categorySlug: product.category?.slug }));
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

        .prod-card {
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }
        .prod-card::before {
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
        .prod-card:hover::before { opacity: 1; }
        .prod-card-shine {
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
        .prod-card:hover .prod-card-shine {
          animation: cardShine 0.9s ease forwards;
        }
        .prod-card-badge { animation: badgePop 0.3s ease forwards; }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up, .anim-blob-1, .anim-blob-2, .anim-shimmer-text,
          .anim-pulse-dot, .prod-card-shine {
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
          {/* Dark Blue Overlay */}
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
                <span className="text-slate-100">New Arrivals</span>
              </div>

              <p
                className="anim-fade-up flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#19d5f2] sm:text-sm"
                style={{ animationDelay: "80ms" }}
              >
                <span className="anim-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#19d5f2]" aria-hidden="true" />
                Fresh in store
              </p>

              <h1
                className="anim-fade-up mt-2 text-[1.55rem] font-bold leading-[1.05] sm:text-5xl"
                style={{ animationDelay: "180ms" }}
              >
                New <span className="anim-shimmer-text">Arrivals</span>
              </h1>

              <p
                className="anim-fade-up mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base"
                style={{ animationDelay: "300ms" }}
              >
                Discover the latest products and newest picks added to Ruman Mart.
              </p>
            </div>
          </div>
        </section>

   <section className="mx-auto max-w-[1800px] px-4 py-10 sm:py-14 md:px-8">
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
    <div className="anim-fade-up" style={{ animationDelay: "0ms" }}>
      <h2 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">
        Just Added
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Explore our latest products.
      </p>
    </div>

    <Link
      href="/categories"
      className="group anim-fade-up inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#0b75a5] transition-colors hover:text-[#064d70]"
      style={{ animationDelay: "80ms" }}
    >
      View Categories

      <ChevronRight
        size={15}
        className="transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
    {products.length === 0 && (
      <div className="col-span-full flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <h3 className="text-lg font-bold text-[#0b1d45]">No new arrivals right now</h3>
          <p className="mt-2 text-sm text-slate-500">New products will appear here when marked as new arrivals.</p>
        </div>
      </div>
    )}
    {products.map((product, index) => (
      <article
        key={product.name}
        className="prod-card anim-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(11,29,69,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(11,117,165,0.28)]"
        style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
      >
        {/* Shine sweep on hover */}
        <span className="prod-card-shine" aria-hidden="true" />

        {/* Product Image */}
        <div className="relative flex h-44 items-center justify-center bg-white p-3 sm:h-36">
          <WishlistButton product={product} />

          <span className="prod-card-badge absolute right-2 top-2 rounded-full bg-gradient-to-r from-[#19c9ee] to-[#0b75a5] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            New
          </span>

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-3">
          <p className="text-[11px] font-semibold text-[#0b75a5]">
            {product.brand}
          </p>

          <h3 className="truncate text-sm font-bold text-[#0b1d45] transition-colors group-hover:text-[#0b75a5]">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />

            <span className="text-[10px] text-slate-400">
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-2">
            <span className="text-sm font-bold text-[#0b1d45]">
              {formatPrice(product.price)}
            </span>

            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>

          <Link
            href={`/categories/${product.categorySlug ?? "electronics"}/${productSlug(product.name)}`}
            className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg bg-[#0b1d45] py-2 text-xs font-semibold text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#19c9ee] group-hover:to-[#0b75a5] group-hover:shadow-md group-hover:shadow-[#19c9ee]/30"
          >
            <ShoppingCart size={13} aria-hidden="true" />
            View Details
          </Link>
        </div>
      </article>
    ))}
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}