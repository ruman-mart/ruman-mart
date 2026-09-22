"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, Home as HomeIcon, ShoppingCart, Star, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type WishlistItem = {
  name: string;
  brand?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function Stars({ rating }: { rating: number }) {
  return <div className="flex">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={12} className={index < Math.round(rating) ? "fill-[#f5a623] text-[#f5a623]" : "fill-slate-200 text-slate-200"} />)}</div>;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        setItems(JSON.parse(localStorage.getItem("ruman-wishlist") ?? "[]") as WishlistItem[]);
      } catch {
        setItems([]);
      }
    };
    loadWishlist();
    window.addEventListener("storage", loadWishlist);
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("wishlist-updated", loadWishlist);
    };
  }, []);

  const removeWishlistItem = (name: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.name !== name);
      localStorage.setItem("ruman-wishlist", JSON.stringify(next));
      window.dispatchEvent(new Event("wishlist-updated"));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
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
  <div
    className="absolute inset-0 bg-[#031a3b]/50"
    aria-hidden="true"
  />

  <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-7 sm:min-h-[280px] md:min-h-[340px] md:px-8 lg:min-h-[380px]">
    <div className="max-w-2xl text-white">

      {/* Breadcrumb - mobile par hidden */}
      <div className="mb-4 hidden items-center gap-1.5 text-xs text-slate-300 sm:flex">
        <Link href="/" className="flex items-center gap-1 hover:text-white">
          <HomeIcon size={12} aria-hidden="true" />
          Home
        </Link>

        <ChevronRight size={12} aria-hidden="true" />

        <span className="text-slate-100">Wishlist</span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19d5f2] sm:text-sm">
        Saved for later
      </p>

      <h1 className="mt-2 text-[1.55rem] font-bold leading-[1.05] sm:text-5xl">
        Your <span className="text-[#19d5f2]">Wishlist</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
        Keep the products you love close and come back when you&apos;re ready.
      </p>

    </div>
  </div>
</section>

        <section className="mx-auto max-w-[1800px] px-4 py-10 sm:py-14 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">Saved Items ({items.length})</h2><p className="mt-1 text-sm text-slate-500">Your favorite products in one place.</p></div><Link href="/categories" className="text-sm font-semibold text-[#0b75a5] hover:text-[#064d70]">Continue Shopping</Link></div>
          {items.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm"><Heart size={42} className="mx-auto text-slate-300" /><h2 className="mt-4 text-lg font-bold text-[#0b1d45]">Your wishlist is empty</h2><p className="mt-1 text-sm text-slate-500">Save products here to find them later.</p></div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map((item) => <div key={item.name} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="relative flex h-44 items-center justify-center p-4"><button type="button" onClick={() => removeWishlistItem(item.name)} aria-label={`Remove ${item.name} from wishlist`} className="absolute right-3 top-3 z-10 text-rose-500 hover:text-rose-700"><Trash2 size={16} /></button><img src={item.image} alt={item.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" /></div><div className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-4"><p className="text-xs font-semibold text-[#0b75a5]">{item.brand}</p><h3 className="text-sm font-bold text-[#0b1d45]">{item.name}</h3><div className="flex items-center gap-1"><Stars rating={item.rating} /><span className="text-[10px] text-slate-400">({item.reviews.toLocaleString()})</span></div><div className="mt-auto flex items-baseline gap-2 pt-3"><span className="font-bold text-[#0b1d45]">{formatPrice(item.price)}</span><span className="text-xs text-slate-400 line-through">{formatPrice(item.originalPrice)}</span></div><Link href={`/categories/electronics/${slugify(item.name)}`} className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b1d45] py-2.5 text-xs font-semibold text-white hover:bg-[#0b75a5]"><ShoppingCart size={14} aria-hidden="true" />View Details</Link></div></div>)}</div>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
