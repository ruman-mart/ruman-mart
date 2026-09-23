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

const categories = [
  "Mobiles & Tablets",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Health",
  "Sports & Outdoor",
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
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState("/logo-web.png");

  useEffect(() => {
    void fetch("/api/settings/shipping").then(async (response) => {
      if (response.ok) setLogoUrl((await response.json()).logoUrl || "/logo-web.png");
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

  const renderSuggestionList = (isMobile = false) => {
    if (!showSuggestions || !query.trim() || suggestions.length === 0) return null;

    return (
      <ul
        className={`absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl ${
          isMobile ? "top-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
        }`}
      >
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
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
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
      {/* Single grid controls logo / search+nav / actions so the nav row
          lines up exactly under the search bar's left edge. */}
      <div className="mx-auto grid max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-x-4 px-4 py-3 md:gap-x-8 md:px-8">
     {/* Logo */}
<Link
  href="/"
  className="row-span-2 flex shrink-0 items-center self-center md:mr-2"
>
  <Image
    src={logoUrl}
    alt="Ruman Mart logo"
    width={120}
    height={68}
    priority
    className="h-[44px] w-auto object-contain md:h-[52px]"
  />
</Link>

        {/* Search — centered within its grid column */}
        <div className="relative mx-auto hidden w-full max-w-xl md:block">
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
          {renderSuggestionList(false)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 justify-self-end md:gap-7">
          <Link href="/wishlist" className="hidden items-center gap-2 text-sm transition-colors hover:text-[#1fb6e6] lg:flex">
            <span className="relative">
              <Heart size={20} strokeWidth={1.75} />
              {wishlistCount > 0 && <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#1fb6e6] text-[11px] font-semibold text-white">{wishlistCount}</span>}
            </span>
            Wishlist
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingCart size={22} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1fb6e6] text-[11px] font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop nav row — sits in the same column as search (col 2),
            so its left edge matches the search bar's left edge. */}
        <nav className="col-start-2 hidden md:block">
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
                    <ul className="absolute left-0 top-full z-50 w-56 overflow-hidden rounded-md bg-white py-2 text-slate-700 shadow-xl">
                      {categories.map((cat) => (
                        <li key={cat}>
                          <Link
                            href={`/categories/${cat
                              .toLowerCase()
                              .replace(/[^a-z]+/g, "-")}`}
                            className="block px-4 py-2 text-sm hover:bg-slate-100 hover:text-[#0b1d45]"
                          >
                            {cat}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <div className="relative py-3">
            <form onSubmit={handleSearch}>
              <div className="flex overflow-hidden rounded-full bg-white">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search for products..."
                  className="w-full bg-transparent px-4 py-2 text-sm text-slate-700 outline-none"
                />
                <button type="submit" className="bg-[#1fb6e6] px-4">
                  <Search size={18} />
                </button>
              </div>
            </form>
            {renderSuggestionList(true)}
          </div>

          <ul className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded px-2 py-2 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="block rounded px-2 py-2 hover:bg-white/10"
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function readWishlistCount() {
  try {
    const items = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]");
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}