import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  House,
  PackageSearch,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f9fc] text-slate-800">
      <Navbar />

      <main className="relative isolate flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-8 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(31,182,230,0.16),transparent_28%),radial-gradient(circle_at_92%_84%,rgba(11,29,69,0.1),transparent_30%)]" />
        <div className="absolute -right-20 top-20 -z-10 h-64 w-64 rounded-full border-[28px] border-[#1fb6e6]/[0.07] sm:h-96 sm:w-96" />
        <div className="absolute bottom-10 left-[7%] -z-10 h-4 w-4 rounded-full bg-[#1fb6e6]/40 shadow-[0_0_0_12px_rgba(31,182,230,0.08)]" />

        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#1fb6e6]/30 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0b75a5] shadow-sm">
              <Sparkles size={14} aria-hidden="true" />
              Error 404
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#0b1d45] sm:text-7xl">
              Oops, this page is out of stock.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              We couldn&apos;t find the page you were looking for. It may have moved,
              or the link may have expired.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b1d45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(11,29,69,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#0b75a5]"
              >
                <House size={17} aria-hidden="true" />
                Back to Home
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-[#0b1d45] transition-all hover:-translate-y-0.5 hover:border-[#1fb6e6] hover:text-[#0b75a5]"
              >
                Explore Products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <Link
              href="/deals"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0b75a5] transition-colors hover:text-[#0b1d45]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Take me to today&apos;s deals
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#1fb6e6]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.25rem] bg-[#0b1d45] p-6 shadow-[0_28px_70px_rgba(11,29,69,0.24)] sm:p-9">
              <div className="flex items-center justify-between text-white/60">
                <span className="text-xs font-bold uppercase tracking-[0.24em]">Ruman Mart</span>
                <Search size={19} aria-hidden="true" />
              </div>
              <div className="relative mt-10 flex aspect-square items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#12356d]">
                <div className="absolute h-56 w-56 rounded-full border-[22px] border-[#1fb6e6]/20" />
                <div className="absolute h-40 w-40 rounded-full border border-white/15" />
                <div className="relative flex h-36 w-36 rotate-[-7deg] items-center justify-center rounded-[2rem] border-2 border-[#1fb6e6] bg-[#f6f9fc] text-[#0b1d45] shadow-[12px_18px_0_rgba(31,182,230,0.25)] sm:h-44 sm:w-44">
                  <PackageSearch size={70} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <span className="absolute right-7 top-8 rounded-full bg-[#1fb6e6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0b1d45]">
                  Missing
                </span>
                <span className="absolute bottom-8 left-7 h-3 w-3 rounded-full bg-white/70" />
                <span className="absolute bottom-12 right-12 h-2 w-2 rounded-full bg-[#1fb6e6]" />
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1fb6e6] text-[#0b1d45]">
                  <ShoppingBag size={19} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold">Your next find is waiting.</p>
                  <p className="mt-0.5 text-xs text-white/55">Browse the latest arrivals and deals.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}