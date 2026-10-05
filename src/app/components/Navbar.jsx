"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Categories", href: "/categories", hasDropdown: true },
  { label: "Deals", href: "/deals" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CART_STORAGE_KEY = "ruman-cart";
const WISHLIST_STORAGE_KEY = "ruman-wishlist";

function readCartCount() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    return Array.isArray(items)
      ? items.reduce((total, item) => total + Number(item?.quantity ?? 0), 0)
      : 0;
  } catch {
    return 0;
  }
}

function readWishlistCount() {
  try {
    const items = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]");
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProductUrl(product) {
  const categorySlug = product?.category?.slug || "electronics";
  const productSlug = slugify(product?.name || "");
  return `/categories/${categorySlug}/${productSlug}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false); // desktop hover dropdown
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // mobile accordion
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState("/logo-web.webp");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    void fetch("/api/settings/shipping").then(async (response) => {
      if (response.ok) setLogoUrl((await response.json()).logoUrl || "/logo-web.webp");
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    void fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    void fetch("/api/categories", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const updateCartCount = () => setCartCount(readCartCount());
    const updateWishlistCount = () => setWishlistCount(readWishlistCount());
    updateCartCount();
    updateWishlistCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("ruman-cart-updated", updateCartCount);
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlist-updated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("ruman-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlist-updated", updateWishlistCount);
    };
  }, []);

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setMenuOpen(false);
    setMobileCatOpen(false);
    setCatOpen(false);
    setShowSuggestions(false);
  }, [pathname]);

  // While the mobile menu is open: lock page scroll, allow Escape to close.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // If the screen grows to desktop size, make sure the mobile menu is closed.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const suggestions = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return [];

    return products
      .filter((product) => {
        const haystack = [product.name, product.brand, product.category?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(searchText);
      })
      .slice(0, 6);
  }, [products, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const target = suggestions[0] || null;
    setShowSuggestions(false);
    if (target) {
      router.push(buildProductUrl(target));
      return;
    }

    router.push("/categories");
  };

  const renderSuggestionList = () => {
    if (!showSuggestions || !query.trim() || suggestions.length === 0) return null;

    return (
      <ul className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[60dvh] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white text-left shadow-xl">
        {suggestions.map((product) => (
          <li key={`${product.id ?? product.slug ?? product.name}-${product.brand ?? "brand"}`}>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery(product.name);
                setShowSuggestions(false);
                router.push(buildProductUrl(product));
              }}
              className="flex min-h-[52px] w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-100 active:bg-slate-100"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <Search size={16} className="text-slate-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                <p className="truncate text-xs text-slate-500">{product.brand} • {product.category?.name || "Category"}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#1fb6e6] bg-[radial-gradient(circle_at_top,#173d7a_0%,#001B42_55%,#00132f_100%)] text-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
      {/*
        Grid layout (every item is placed explicitly so nothing jumps around):

        Mobile  (<768px)   row 1: logo | (empty) | wishlist, cart, menu
                           row 2: full-width search bar
        Desktop (>=768px)  logo spans 2 rows | search / nav | actions
      */}
      <div className="mx-auto grid max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2.5 px-3 py-2.5 min-[380px]:px-4 md:gap-x-8 md:gap-y-0 md:px-8 md:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="col-start-1 row-start-1 flex shrink-0 items-center self-center md:row-span-2 md:mr-2"
        >
          <Image
            src={logoUrl}
            alt="Ruman Mart logo"
            width={120}
            height={68}
            priority
            onError={() => setLogoUrl("/logo-web.webp")}
            className="h-10 w-auto object-contain min-[380px]:h-[44px] md:h-[52px]"
          />
        </Link>

        {/* Desktop search */}
        <div className="relative mx-auto hidden w-full max-w-xl md:col-start-2 md:row-start-1 md:block">
          <form onSubmit={handleSearch}>
            <div className="flex w-full overflow-hidden rounded-full bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex items-center justify-center bg-[#1fb6e6] px-6 text-white transition-colors hover:bg-[#189ac4]"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
          {renderSuggestionList()}
        </div>

        {/* Actions */}
        <div className="col-start-3 row-start-1 flex items-center gap-1 justify-self-end md:gap-7">
          {/* Wishlist: icon-only on phones/tablets (so it is always reachable), icon + label on large screens */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="flex h-11 w-11 items-center justify-center gap-2 text-sm transition-colors hover:text-[#1fb6e6] lg:h-auto lg:w-auto"
          >
            <span className="relative">
              <Heart size={24} strokeWidth={1.75} className="lg:h-5 lg:w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1fb6e6] px-1 text-[11px] font-semibold text-white lg:-right-3 lg:-top-3">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">Wishlist</span>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-11 w-11 items-center justify-center md:h-auto md:w-auto"
          >
            <ShoppingCart size={26} strokeWidth={1.75} className="md:h-7 md:w-7" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1fb6e6] px-1 text-[11px] font-semibold md:-right-2 md:-top-2">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg active:bg-white/10 md:hidden"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile search: always visible under the logo row */}
        <div className="relative col-span-3 row-start-2 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="flex overflow-hidden rounded-full bg-white">
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search products, brands..."
                aria-label="Search products"
                // 16px font stops iOS Safari from zooming in when the field is focused
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-base text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex w-14 shrink-0 items-center justify-center bg-[#1fb6e6] text-white active:bg-[#189ac4]"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
          {renderSuggestionList()}
        </div>

        {/* Desktop nav row: same column as search, so left edges line up */}
        <nav className="hidden md:col-start-2 md:row-start-2 md:block">
          <ul className="flex items-center justify-center gap-4 pt-2 text-xs lg:gap-8 lg:text-sm">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setCatOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setCatOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 border-b-2 pb-1.5 transition-colors ${
                      active
                        ? "border-[#1fb6e6] text-white"
                        : "border-transparent text-slate-200 hover:text-[#1fb6e6]"
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={14} />}
                  </Link>

                  {link.hasDropdown && catOpen && (
                    <ul className="absolute left-0 top-full z-50 max-h-[70dvh] w-56 overflow-y-auto overflow-hidden rounded-md bg-white py-2 text-slate-700 shadow-xl">
                      {categories.map((cat) => (
                        <li key={cat.id ?? cat.slug}>
                          <Link
                            href={`/categories/${cat.slug}`}
                            className="block px-4 py-2 text-sm hover:bg-slate-100 hover:text-[#0b1d45]"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile menu: scrolls inside itself if the list is taller than the screen */}
      {menuOpen && (
        <nav
          aria-label="Mobile menu"
          className="max-h-[calc(100dvh-8.5rem)] overflow-y-auto overscroll-contain border-t border-white/10 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 min-[380px]:px-4 md:hidden"
        >
          <ul className="flex flex-col text-[15px]">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const rowClass = `flex min-h-12 flex-1 items-center rounded-lg px-3 transition-colors active:bg-white/10 ${
                active ? "bg-white/10 font-semibold text-[#1fb6e6]" : "text-slate-100"
              }`;

              if (link.hasDropdown) {
                return (
                  <li key={link.label}>
                    <div className="flex items-stretch">
                      <Link href={link.href} className={rowClass}>
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileCatOpen((v) => !v)}
                        aria-label={mobileCatOpen ? "Hide categories" : "Show categories"}
                        aria-expanded={mobileCatOpen}
                        className="flex w-12 items-center justify-center rounded-lg active:bg-white/10"
                      >
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 motion-reduce:transition-none ${
                            mobileCatOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {mobileCatOpen && (
                      <ul className="mb-1 ml-3 border-l border-white/15 pl-2">
                        {categories.length === 0 && (
                          <li className="px-3 py-3 text-sm text-slate-300">Loading…</li>
                        )}
                        {categories.map((cat) => (
                          <li key={cat.id ?? cat.slug}>
                            <Link
                              href={`/categories/${cat.slug}`}
                              className="flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-200 active:bg-white/10"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.label} className="flex">
                  <Link href={link.href} className={rowClass}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}