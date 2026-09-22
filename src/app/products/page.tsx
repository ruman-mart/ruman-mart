"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  Grid3x3,
  List,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddToCartButton from "../components/AddToCartButton";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  discount: number;
  image: string;
};

const categoryFilters = [
  "All",
  "Electronics",
  "Homeware",
  "Kitchen Accessories",
  "Style Gadgets",
  "Perfumes",
  "Watches",
];

const allProducts: Product[] = [
  { id: "laptop-hp", name: "Laptop 15.6\" Full HD", brand: "HP", category: "Electronics", price: 89999, originalPrice: 142999, rating: 4.6, reviews: 1200, discount: 37, image: "/products/laptop-hp.png" },
  { id: "earbuds", name: "Wireless Earbuds", brand: "Apple", category: "Electronics", price: 7999, originalPrice: 12999, rating: 4.7, reviews: 2200, discount: 38, image: "/products/earbuds.png" },
  { id: "smartwatch", name: "Smart Watch", brand: "Samsung", category: "Watches", price: 12999, originalPrice: 18999, rating: 4.6, reviews: 742, discount: 32, image: "/products/smartwatch.png" },
  { id: "smartphone", name: "Smartphone 256GB", brand: "Apple", category: "Electronics", price: 149999, originalPrice: 199999, rating: 4.8, reviews: 3900, discount: 25, image: "/products/smartphone.png" },
  { id: "tws-earphones", name: "TWS Earphones", brand: "Boat", category: "Electronics", price: 6999, originalPrice: 9999, rating: 4.4, reviews: 5300, discount: 30, image: "/products/tws-earphones.png" },
  { id: "gaming-laptop", name: "Gaming Laptop", brand: "Asus", category: "Electronics", price: 159999, originalPrice: 199999, rating: 4.7, reviews: 966, discount: 20, image: "/products/gaming-laptop.png" },
  { id: "bluetooth-speaker", name: "Bluetooth Speaker", brand: "JBL", category: "Electronics", price: 14599, originalPrice: 19999, rating: 4.6, reviews: 1900, discount: 27, image: "/products/bluetooth-speaker.png" },
  { id: "air-fryer", name: "Air Fryer", brand: "Philips", category: "Kitchen Accessories", price: 15499, originalPrice: 22999, rating: 4.5, reviews: 742, discount: 32, image: "/products/air-fryer.png" },
  { id: "bed-set", name: "Comfort Bed Set", brand: "Homeware Co.", category: "Homeware", price: 8999, originalPrice: 14999, rating: 4.8, reviews: 1100, discount: 33, image: "/products/bed-set.png" },
  { id: "mens-perfume", name: "Men's Perfume", brand: "Bleu de Chanel", category: "Perfumes", price: 5999, originalPrice: 9999, rating: 4.6, reviews: 843, discount: 40, image: "/products/perfume.png" },
  { id: "luxury-watch", name: "Luxury Watch", brand: "Rolex Style", category: "Watches", price: 18999, originalPrice: 28999, rating: 4.7, reviews: 920, discount: 37, image: "/products/luxury-watch.png" },
  { id: "led-monitor", name: "LED Monitor 24\"", brand: "Samsung", category: "Electronics", price: 34999, originalPrice: 44999, rating: 4.4, reviews: 936, discount: 22, image: "/products/led-monitor.png" },
  { id: "mechanical-keyboard", name: "Mechanical Keyboard", brand: "Redragon", category: "Style Gadgets", price: 11999, originalPrice: 18999, rating: 4.6, reviews: 674, discount: 36, image: "/products/mechanical-keyboard.png" },
  { id: "gaming-mouse", name: "Gaming Mouse", brand: "Logitech", category: "Style Gadgets", price: 7599, originalPrice: 9999, rating: 4.8, reviews: 1100, discount: 24, image: "/products/gaming-mouse.png" },
  { id: "power-bank", name: "Power Bank 20000mAh", brand: "Mi", category: "Electronics", price: 6999, originalPrice: 10499, rating: 4.6, reviews: 1400, discount: 33, image: "/products/power-bank.png" },
  { id: "action-camera", name: "Action Camera", brand: "GoPro", category: "Electronics", price: 44999, originalPrice: 59999, rating: 4.7, reviews: 512, discount: 21, image: "/products/action-camera.png" },
];

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-[#f5a623] text-[#f5a623]"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews; // popularity default
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#031a3b]">
  {/* Mobile Hero */}
  <div
    className="absolute inset-0 bg-[url('/mobile-hero.png')] bg-cover bg-center sm:hidden"
    aria-hidden="true"
  />

  {/* Desktop Hero */}
  <div
    className="absolute inset-0 hidden bg-[url('/hero.png')] bg-cover bg-center sm:block"
    aria-hidden="true"
  />

  {/* Dark Blue Overlay */}
  <div
    className="absolute inset-0 bg-[#031a3b]/50"
    aria-hidden="true"
  />

  <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-8 sm:min-h-[280px] md:min-h-[340px] md:px-8 lg:min-h-[380px]">
    
    {/* Breadcrumb - mobile par hidden */}
    <div className="absolute inset-x-5 top-0 hidden items-center gap-1.5 py-4 text-sm text-slate-300 sm:flex md:inset-x-8">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-white"
      >
        <HomeIcon size={14} aria-hidden="true" />
        Home
      </Link>

      <ChevronRight
        size={14}
        className="text-slate-400"
        aria-hidden="true"
      />

      <span className="font-semibold text-white">
        Products
      </span>
    </div>

    <div className="max-w-xl text-white">
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        All <span className="text-[#19d5f2]">Products</span>
      </h1>

      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
        Browse our full catalog of quality products, handpicked for
        every need and budget.
      </p>
    </div>
  </div>
</section>

      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:py-8 md:px-8">
  {/* Mobile filter toggle */}
  <button
    type="button"
    onClick={() => setMobileFiltersOpen(true)}
    className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b1d45] shadow-sm lg:hidden"
  >
    <SlidersHorizontal size={16} aria-hidden="true" />
    Filter by Category
  </button>

  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
    {/* Sidebar - category filters (desktop) */}
    <aside className="hidden h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
      <h2 className="mb-3 text-sm font-bold text-[#0b1d45]">
        Categories
      </h2>

      <div className="flex flex-col gap-1">
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#e6f7fc] text-[#0b75a5]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </aside>

    {/* Mobile filter drawer */}
    {mobileFiltersOpen && (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileFiltersOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div className="relative ml-auto flex h-full w-[85%] max-w-xs flex-col bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0b1d45]">
              Categories
            </h2>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setMobileFiltersOpen(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#e6f7fc] text-[#0b75a5]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
            {/* Main content */}
            <div>
           {/* Header bar */}
<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* Title */}
  <div className="min-w-0">
    <h2 className="truncate text-xl font-bold text-[#0b1d45]">
      {activeCategory === "All" ? "All Products" : activeCategory}
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Showing {sortedProducts.length} products
    </p>
  </div>

  {/* Controls */}
  <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
    {/* Sort */}
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19c9ee] sm:w-auto sm:text-sm"
        aria-label="Sort by"
      >
        <option value="popularity">Sort by: Popularity</option>
        <option value="price-low">Sort by: Price - Low to High</option>
        <option value="price-high">Sort by: Price - High to Low</option>
        <option value="rating">Sort by: Rating</option>
      </select>

      <ChevronRight
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
        aria-hidden="true"
      />
    </div>

    {/* Grid / List */}
    <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
        className={`flex h-9 w-9 items-center justify-center transition-colors ${
          viewMode === "grid"
            ? "bg-[#19c9ee] text-white"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <Grid3x3 size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => setViewMode("list")}
        aria-label="List view"
        className={`flex h-9 w-9 items-center justify-center transition-colors ${
          viewMode === "list"
            ? "bg-[#19c9ee] text-white"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <List size={16} aria-hidden="true" />
      </button>
    </div>
  </div>
       </div>
{/* Category chips (mobile-visible active filter) */}
{activeCategory !== "All" && (
  <div className="mb-4 flex items-center gap-2">
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f7fc] px-3 py-1.5 text-xs font-semibold text-[#0b75a5]">
      {activeCategory}

      <button
        type="button"
        onClick={() => setActiveCategory("All")}
        aria-label="Clear filter"
        className="rounded-full"
      >
        <X size={13} aria-hidden="true" />
      </button>
    </span>
  </div>
)}

{/* Product grid/list */}
{sortedProducts.length === 0 ? (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
    <p className="text-base font-bold text-[#0b1d45]">
      No products found
    </p>

    <p className="text-sm text-slate-500">
      Try selecting a different category.
    </p>
  </div>
) : viewMode === "grid" ? (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-4">
    {sortedProducts.map((product) => (
      <article
        key={product.id}
        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <Link
          href={`/products/${product.id}`}
          className="contents"
        >
          {/* Product image */}
          <div className="relative flex h-44 items-center justify-center bg-white px-4 pt-4 sm:h-40">
            {product.originalPrice > product.price && product.discount > 0 && <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[11px] font-bold text-white">
                -{product.discount}%
              </span>}

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
            <p className="text-xs text-[#0b75a5]">
              {product.brand}
            </p>

            <h3 className="truncate text-sm font-bold text-[#0b1d45]">
              {product.name}
            </h3>

            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-base font-bold text-[#0b1d45]">
                {formatPrice(product.price)}
              </span>

              {product.originalPrice > product.price && product.discount > 0 && <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>}
            </div>
          </div>
        </Link>

        {/* Add to Cart */}
        <div className="px-4 pb-4">
          <AddToCartButton productSlug={product.id} name={product.name} price={product.price} image={product.image} />
        </div>
      </article>
    ))}
  </div>
) : (
  /* List view */
  <div className="flex flex-col gap-4">
    {sortedProducts.map((product) => (
      <article
        key={product.id}
        className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row"
      >
        {/* Image */}
        <Link
          href={`/products/${product.id}`}
          className="relative flex h-44 w-full shrink-0 items-center justify-center rounded-lg bg-[#f5f7fb] sm:h-28 sm:w-28"
        >
          {product.originalPrice > product.price && product.discount > 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[10px] font-bold text-white">
              -{product.discount}%
            </span>}

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Product info */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <p className="text-xs text-[#0b75a5]">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`}>
            <h3 className="truncate text-sm font-bold text-[#0b1d45] hover:text-[#0b75a5] sm:text-base">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-[#0b1d45] sm:text-lg">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice > product.price && product.discount > 0 && <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="flex w-full shrink-0 items-center sm:w-auto">
          <AddToCartButton productSlug={product.id} name={product.name} price={product.price} image={product.image} />
        </div>
      </article>
    ))}
  </div>
)}
              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                  >
                    <ChevronRight size={16} className="rotate-180" aria-hidden="true" />
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                        page === 1
                          ? "bg-[#19c9ee] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}