"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  Star,
  Truck,
  ShieldCheck,
  Award,
  Headset,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  Minus,
  Plus,
  Check,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import LoadingScreen from "../../../components/LoadingScreen";
import WishlistButton from "../../../components/WishlistButton";
import AddToCartButton from "../../../components/AddToCartButton";

type RelatedProduct = {
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  discount: number;
  image: string;
};

type QuickSpec = { label: string; sub: string };

type ProductData = {
  categoryName: string;
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  images: string[];
  colors: string[];
  storageOptions: string[];
  quickSpecs: QuickSpec[];
  description: string;
  keyFeatures: string[];
  stockQuantity: number;
  videoUrl?: string | null;
};

type StoredCartItem = {
  id: string;
  productSlug: string;
  name: string;
  specs: string[];
  price: number;
  quantity: number;
  inStock: boolean;
  stockQuantity: number;
  image: string;
};

const CART_STORAGE_KEY = "ruman-cart";

const fallbackProduct: ProductData = {
  categoryName: "Electronics",
  brand: "HP",
  name: "Laptop 15.6\" Full HD",
  rating: 4.6,
  reviews: 1200,
  price: 89999,
  originalPrice: 142999,
  discount: 37,
  inStock: true,
  images: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=85",
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&q=85",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&q=85",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85",
  ],
  colors: ["Silver", "Space Grey"],
  storageOptions: ["256GB SSD", "512GB SSD"],
  quickSpecs: [
    { label: "15.6\" Full HD Display", sub: "Crystal clear visuals" },
    { label: "Intel Core i5", sub: "Fast & reliable" },
    { label: "8GB RAM", sub: "Smooth multitasking" },
    { label: "256GB SSD", sub: "Fast storage" },
    { label: "Windows 11", sub: "Latest OS" },
  ],
  description:
    "The HP Laptop 15.6\" Full HD laptop is designed to deliver a seamless computing experience. Whether you're working, studying, or enjoying entertainment, this laptop offers the perfect balance of performance, style, and portability.",
  keyFeatures: [
    "15.6\" Full HD (1920 x 1080) display",
    "Intel Core i5 processor",
    "8GB DDR4 RAM",
    "256GB SSD storage",
    "Windows 11 Home",
    "Lightweight and portable design",
  ],
  stockQuantity: 12,
};

const trustIcons: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Truck, title: "Fast Delivery", text: "Quick delivery to your doorstep" },
  { Icon: ShieldCheck, title: "Secure Payments", text: "100% secure checkout" },
  { Icon: Award, title: "Quality Products", text: "Carefully selected for you" },
  { Icon: Headset, title: "24/7 Support", text: "We're here to help" },
];

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function parseJsonArray<T>(value: string | T[] | undefined, fallback: T[]): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeQuickSpecs(value: string | Array<string | QuickSpec> | undefined, fallback: QuickSpec[]): QuickSpec[] {
  const parsed = parseJsonArray<QuickSpec | string>(value, fallback);
  if (!parsed.length) return fallback;

  return parsed
    .map((item) => {
      if (typeof item === "string") return { label: item, sub: "" };
      return { label: String(item?.label ?? ""), sub: String(item?.sub ?? "") };
    })
    .filter((item) => item.label);
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string; product: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const hasDiscount = product ? product.originalPrice > product.price && product.discount > 0 : false;
  const hasStock = product ? product.inStock && product.stockQuantity > 0 : false;

  function handleAddToCart(destination = "/cart") {
    if (!product || !hasStock) return;
    const cartItem: StoredCartItem = {
      id: `${params.product}-${selectedColor}-${selectedStorage}`,
      productSlug: params.product,
      name: product.name,
      specs: [selectedColor, selectedStorage].filter(Boolean),
      price: product.price,
      quantity,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      image: product.images[0],
    };
    let cartItems: StoredCartItem[] = [];
    try {
      cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as StoredCartItem[];
    } catch {
      cartItems = [];
    }
    const existingIndex = cartItems.findIndex((item) => item.id === cartItem.id);
    if (existingIndex >= 0) {
      cartItems[existingIndex] = {
        ...cartItems[existingIndex],
        quantity: Math.min(product.stockQuantity, cartItems[existingIndex].quantity + quantity),
      };
    } else {
      cartItems.push(cartItem);
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new Event("ruman-cart-updated"));
    router.push(destination);
  }

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.colors[0] ?? "");
    setSelectedStorage(product.storageOptions[0] ?? "");
  }, [product]);

  useEffect(() => {
    if (!product) return;
    void fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) return [];
        return await response.json() as Array<{
          slug: string;
          name: string;
          price: number;
          originalPrice: number;
          rating: number | string;
          reviews: number;
          image: string;
          images?: string | string[];
          category?: { slug: string };
        }>;
      })
      .then((products) => {
        setRelatedProducts(
          products
            .filter((item) => item.slug !== params.product && item.category?.slug === params.slug)
            .slice(0, 5)
            .map((item) => ({
              slug: item.slug,
              name: item.name,
              price: Number(item.price),
              originalPrice: Number(item.originalPrice),
              rating: Number(item.rating),
              reviews: Number(item.reviews),
              discount: item.originalPrice > item.price
                ? Math.round((1 - item.price / item.originalPrice) * 100)
                : 0,
              image: parseJsonArray<string>(item.images, [item.image])[0] || item.image,
            })),
        );
      })
      .catch(() => setRelatedProducts([]));
  }, [params.product, params.slug, product]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    void fetch(`/api/products/${params.product}`).then(async (response) => {
      if (!mounted) return;
      if (!response.ok) {
        setProduct(null);
        setIsLoading(false);
        return;
      }
      const data = await response.json() as {
        name: string;
        brand: string;
        price: number;
        originalPrice: number;
        rating: number | string;
        reviews: number;
        image: string;
        images?: string | string[];
        videoUrl?: string | null;
        colors?: string | string[];
        storageOptions?: string | string[];
        quickSpecs?: string | Array<string | QuickSpec>;
        description?: string;
        keyFeatures?: string | string[];
        inStock?: boolean;
        stockQuantity?: number;
        category?: { name: string; slug: string };
      };

      const gallery = parseJsonArray<string>(data.images, [data.image]).filter(Boolean);
      const normalizedProduct: ProductData = {
        categoryName: data.category?.name ?? params.slug ?? fallbackProduct.categoryName,
        brand: data.brand ?? fallbackProduct.brand,
        name: data.name ?? fallbackProduct.name,
        rating: Number(data.rating ?? fallbackProduct.rating),
        reviews: Number(data.reviews ?? fallbackProduct.reviews),
        price: Number(data.price ?? fallbackProduct.price),
        originalPrice: Number(data.originalPrice ?? fallbackProduct.originalPrice),
        discount: Number(data.originalPrice && data.price ? Math.max(0, Math.round((1 - data.price / data.originalPrice) * 100)) : fallbackProduct.discount),
        inStock: Boolean(data.inStock ?? true),
        images: gallery.length ? gallery : [data.image || fallbackProduct.images[0]],
        colors: parseJsonArray<string>(data.colors, fallbackProduct.colors),
        storageOptions: parseJsonArray<string>(data.storageOptions, fallbackProduct.storageOptions),
        quickSpecs: normalizeQuickSpecs(data.quickSpecs, []),
        description: data.description || fallbackProduct.description,
        keyFeatures: parseJsonArray<string>(data.keyFeatures, fallbackProduct.keyFeatures),
        stockQuantity: Number(data.stockQuantity ?? product?.stockQuantity ?? fallbackProduct.stockQuantity ?? 0),
        videoUrl: data.videoUrl?.trim() || null,
      };

      setProduct(normalizedProduct);
      setIsLoading(false);
    }).catch(() => {
      if (mounted) {
        setProduct(null);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [params.product, params.slug]);

  if (isLoading) {
    return <LoadingScreen title="Loading product..." description="Fetching product details." />;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#0b1d45]">Product not found</h1>
            <p className="mt-2 text-sm text-slate-500">The product you are looking for does not exist or is no longer available.</p>
            <button
              type="button"
              onClick={() => router.push("/categories")}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0b1d45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b75a5]"
            >
              Browse Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs: Array<{ key: "description" | "specifications" | "reviews"; label: string }> = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    ...(product.reviews > 0 ? [{ key: "reviews" as const, label: `Reviews (${product.reviews.toLocaleString()})` }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            brand: { "@type": "Brand", name: product.brand },
            image: product.images,
            description: product.description,
            offers: {
              "@type": "Offer",
              priceCurrency: "PKR",
              price: product.price,
              availability: product.inStock && product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rumanmart.com"}/categories/${params.slug}/${params.product}`,
            },
            ...(product.reviews > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews } } : {}),
          }),
        }}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-[1800px] px-4 py-5 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-[#0b75a5]">
              <HomeIcon size={14} aria-hidden="true" />
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
            <Link href="/categories/electronics" className="hover:text-[#0b75a5]">
              Electronics
            </Link>
            <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
            <Link href="/categories/electronics" className="hover:text-[#0b75a5]">
              Laptops
            </Link>
            <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
            <span className="font-semibold text-[#0b1d45]">
              {product.name}
            </span>
          </div>

          {/* Main product section */}
          <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Gallery */}
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <div className="scrollbar-hide flex max-w-full flex-row gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 bg-[#f5f7fb] p-1.5 transition-colors sm:h-16 sm:w-16 ${
                      activeImage === i
                        ? "border-[#19c9ee]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>

              <div className="relative flex h-[320px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#f5f7fb] sm:h-[420px] lg:h-[520px]">
                <WishlistButton product={{ ...product, image: product.images[0] }} />
                {hasDiscount && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#0b75a5] px-2.5 py-1 text-xs font-bold text-white">
                    -{product.discount}%
                  </span>
                )}
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-contain p-2 sm:p-3"
                />
              </div>
              {product.videoUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-black">
                  <video controls preload="metadata" className="h-auto max-h-[360px] w-full" src={product.videoUrl}>
                    Your browser does not support video playback.
                  </video>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-[#0b75a5]">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold text-[#0b1d45] sm:text-3xl">
                {product.name}
              </h1>

              {product.reviews > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-sm font-semibold text-[#0b1d45]">
                    {product.rating}
                  </span>
                  <span className="text-sm text-slate-400">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-[#0b1d45]">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className={`flex items-center gap-1.5 font-semibold ${hasStock ? "text-emerald-600" : "text-rose-600"}`}>
                  <Check size={15} aria-hidden="true" />
                  {hasStock ? "In Stock" : "Out of Stock"}
                </span>
                {product.stockQuantity > 0 && (
                  <span className="text-sm text-slate-500">{product.stockQuantity} available</span>
                )}
              </div>

              {/* Color */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-[#0b1d45]">
                  Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "border-[#19c9ee] bg-[#e6f7fc] text-[#0b75a5]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              {product.storageOptions.length > 0 && <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#0b1d45]">Storage</p>
                <div className="flex gap-2">
                  {product.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      type="button"
                      onClick={() => setSelectedStorage(storage)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedStorage === storage
                          ? "border-[#19c9ee] bg-[#e6f7fc] text-[#0b75a5]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>}

              {/* Quantity */}
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#0b1d45]">Quantity</p>
                <div className="flex w-fit items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!hasStock}
                    className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} aria-hidden="true" />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-[#0b1d45]">
                    {hasStock ? quantity : 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 1, q + 1))}
                    disabled={!hasStock}
                    className="flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleAddToCart()}
                    disabled={!hasStock}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0b1d45] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b75a5] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <ShoppingCart size={16} aria-hidden="true" />
                    {hasStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart("/checkout")}
                    disabled={!hasStock}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#19c9ee] py-3 text-sm font-semibold text-[#0b75a5] transition-colors hover:bg-[#e6f7fc] disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                  >
                    <Zap size={16} aria-hidden="true" />
                    Buy Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Trust icons */}
          <div className="mt-6 grid grid-cols-2 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {trustIcons.map(({ Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-4 sm:justify-center">
                <Icon size={22} className="shrink-0 text-[#0b75a5]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#0b1d45]">{title}</p>
                  <p className="truncate text-xs text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick specs */}
          {product.quickSpecs.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {product.quickSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm"
                >
                  <p className="text-xs font-bold text-[#0b1d45]">{spec.label}</p>
                  {spec.sub && <p className="mt-0.5 text-[11px] text-slate-500">{spec.sub}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex border-b border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3.5 text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 border-[#19c9ee] text-[#0b75a5]"
                      : "text-slate-500 hover:text-[#0b1d45]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === "description" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <h3 className="text-base font-bold text-[#0b1d45]">
                      Product Description
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>

                    <h4 className="mt-5 text-sm font-bold text-[#0b1d45]">
                      Key Features
                    </h4>
                    <ul className="mt-2 flex flex-col gap-2">
                      {product.keyFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check size={15} className="mt-0.5 shrink-0 text-[#0b75a5]" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-[#0b1d45] p-6 text-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-32 w-full object-contain"
                    />
                    <p className="text-lg font-bold text-white">
                      Work. Study. Play.
                    </p>
                    <p className="text-sm text-[#19d5f2]">All in One Laptop</p>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {product.keyFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm"
                    >
                      <span className="text-slate-500">{feature.split(" ")[0]}</span>
                      <span className="font-semibold text-[#0b1d45]">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && product.reviews > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <StarRating rating={product.rating} size={18} />
                    <span className="text-lg font-bold text-[#0b1d45]">
                      {product.rating} out of 5
                    </span>
                    <span className="text-sm text-slate-400">
                      Based on {product.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Customer reviews will be shown here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* You May Also Like */}
          {relatedProducts.length > 0 && <div className="mt-10">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg font-bold text-[#0b1d45] sm:text-xl">
                You May Also Like
              </h2>
              <Link
                href={`/categories/${params.slug}`}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0b75a5] hover:text-[#064d70] sm:text-sm"
              >
                View All <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
              {relatedProducts.map((item) => (
                <div
                  key={item.name}
                  className="group flex min-w-[180px] snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-w-0"
                >
                  <Link href={`/categories/${params.slug}/${item.slug}`} className="relative flex h-32 items-center justify-center bg-white px-3 pt-3">
                    {item.discount > 0 && <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[10px] font-bold text-white">
                      -{item.discount}%
                    </span>}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2">
                    <h3 className="truncate text-xs font-bold text-[#0b1d45]">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-[#0b1d45]">
                        {formatPrice(item.price)}
                      </span>
                        {item.discount > 0 && <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>}
                    </div>
                    <AddToCartButton productSlug={item.slug} name={item.name} price={item.price} image={item.image} />
                  </div>
                </div>
              ))}
            </div>
          </div>}
        </div>
      </main>

      <Footer />
    </div>
  );
}