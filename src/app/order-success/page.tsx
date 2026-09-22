"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Truck,
  FileText,
  Star,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddToCartButton from "../components/AddToCartButton";

type OrderItem = {
  id?: string;
  name: string;
  brand?: string;
  qty?: number;
  quantity?: number;
  price: number;
  image: string;
  specs?: string[];
};

type RelatedProduct = {
  slug: string;
  categorySlug: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  discount: number;
  image: string;
};

const orderItems: OrderItem[] = [
  { name: "Laptop 15.6\" Full HD", brand: "Intel Core i5 | 8GB RAM | 512GB SSD, Windows 11", qty: 1, price: 89999, image: "/products/laptop-hp.png" },
  { name: "Wireless Earbuds", brand: "Apple", qty: 1, price: 7999, image: "/products/earbuds.png" },
  { name: "Smart Watch", brand: "Samsung", qty: 1, price: 12999, image: "/products/smartwatch.png" },
];

type OrderSnapshot = {
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
};

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function productSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
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

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderSnapshot>({
    orderNumber: searchParams.get("order") ?? "RM-000000",
    orderDate: new Date().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }),
    paymentMethod: "Cash on Delivery",
    items: orderItems,
    subtotal: orderItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    shippingCost: 0,
    discount: 0,
    total: orderItems.reduce((sum, item) => sum + item.price * item.qty, 0),
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("ruman-last-order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<OrderSnapshot>;
        if (parsed.orderNumber || parsed.items?.length) {
          setOrderDetails({
            orderNumber: parsed.orderNumber ? `#${parsed.orderNumber}` : "#RM-000000",
            orderDate: parsed.orderDate ? new Date(parsed.orderDate).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : new Date().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }),
            paymentMethod: parsed.paymentMethod ?? "Cash on Delivery",
            items: (parsed.items ?? []).map((item) => ({
              ...item,
              qty: item.qty ?? item.quantity ?? 1,
              brand: item.brand ?? item.specs?.join(" ") ?? "Product",
            })),
            subtotal: Number(parsed.subtotal ?? 0),
            shippingCost: Number(parsed.shippingCost ?? 0),
            discount: Number(parsed.discount ?? 0),
            total: Number(parsed.total ?? (parsed.subtotal ?? 0)),
          });
        }
      } catch {
        // ignore malformed saved order data
      }
    }
  }, []);

  useEffect(() => {
    const orderNames = new Set(orderDetails.items.map((item) => item.name));
    void fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) return [];
        return await response.json() as Array<{
          slug: string;
          name: string;
          price: number;
          originalPrice: number;
          image: string;
          images?: string | string[];
          category?: { slug: string };
          rating?: number | string;
          reviews?: number;
        }>;
      })
      .then((products) => {
        const limited = products
          .filter((product) => !orderNames.has(product.name))
          .slice(0, 5)
          .map((product) => {
            const images = Array.isArray(product.images)
              ? product.images
              : (() => {
                  try { return JSON.parse(product.images ?? "[]") as string[]; } catch { return []; }
                })();
            const discount = product.originalPrice > product.price
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;
            return {
              slug: product.slug,
              categorySlug: product.category?.slug ?? "categories",
              name: product.name,
              price: Number(product.price),
              originalPrice: Number(product.originalPrice),
              rating: Number(product.rating ?? 0),
              reviews: Number(product.reviews ?? 0),
              discount,
              image: images[0] || product.image,
            } satisfies RelatedProduct;
          });
        setRelatedProducts(limited);
      })
      .catch(() => setRelatedProducts([]));
  }, [orderDetails.items]);

  const subtotal = useMemo(() => orderDetails.items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty ?? item.quantity ?? 1), 0), [orderDetails.items]);
  const shipping = orderDetails.shippingCost;
  const discount = orderDetails.discount;
  const total = orderDetails.total || subtotal + shipping - discount;

  const displayItems = orderDetails.items.length ? orderDetails.items : orderItems;

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 bg-[#f5f7fb]">
        {/* Hero */}
        <section className="relative isolate flex min-h-[160px] w-full items-center overflow-hidden bg-gradient-to-r from-[#031a3b] to-[#0b1d45] px-5 py-8 md:min-h-[180px] md:px-8">
          <div className="relative z-10 mx-auto flex w-full max-w-[1800px] items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#19d5f2]">
                <CheckCircle2 size={24} className="text-[#19d5f2]" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-bold leading-none sm:text-3xl">
                  Order <span className="text-[#19d5f2]">Success</span>
                </h1>
                <p className="mt-2 text-xs text-slate-200 sm:text-sm">
                  Your order has been placed successfully!
                </p>
                <p className="mt-1 text-xs italic text-slate-300">
                  Thank you for shopping with Ruman Mart!
                </p>
              </div>
            </div>

            <div className="relative hidden shrink-0 sm:block">
              <ShoppingBag
                size={72}
                strokeWidth={1.3}
                className="text-[#19d5f2]"
                aria-hidden="true"
              />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#19c9ee] text-white ring-4 ring-[#031a3b]">
                <CheckCircle2 size={15} aria-hidden="true" />
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1800px] px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              {/* Confirmation card */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={34} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#0b1d45] sm:text-2xl">
                  Order Placed Successfully!
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Your order{" "}
                  <span className="font-semibold text-[#0b75a5]">
                    {orderDetails.orderNumber}
                  </span>{" "}
                  is confirmed and will be processed shortly.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-white px-3 py-3 shadow-sm">
                    <p className="text-[11px] font-medium text-slate-400">Order Number</p>
                    <p className="mt-1 text-sm font-bold text-[#0b1d45]">
                      {orderDetails.orderNumber}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-3 shadow-sm">
                    <p className="text-[11px] font-medium text-slate-400">Order Date</p>
                    <p className="mt-1 text-sm font-bold text-[#0b1d45]">
                      {orderDetails.orderDate}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-3 shadow-sm">
                    <p className="text-[11px] font-medium text-slate-400">Total Amount</p>
                    <p className="mt-1 text-sm font-bold text-[#0b75a5]">
                      {formatPrice(total)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-3 shadow-sm">
                    <p className="text-[11px] font-medium text-slate-400">Payment Method</p>
                    <p className="mt-1 text-sm font-bold text-[#0b1d45]">
                      {orderDetails.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#19c9ee] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0db4d8]"
                  >
                    <ShoppingBag size={16} aria-hidden="true" />
                    Continue Shopping
                  </Link>
                  <Link
                    href={`/orders/${orderDetails.orderNumber.replace("#", "")}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#19c9ee] py-3 text-sm font-semibold text-[#0b75a5] transition-colors hover:bg-[#e6f7fc]"
                  >
                    <FileText size={16} aria-hidden="true" />
                    View Order Details
                  </Link>
                </div>
              </div>

          
              {/* You May Also Like */}
              <div className="mt-2">
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-lg font-bold text-[#0b1d45] sm:text-xl">
                    You May Also Like
                  </h2>
                  <Link
                    href="/"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0b75a5] hover:text-[#064d70] sm:text-sm"
                  >
                    View All <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                </div>

                <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
                  {relatedProducts.map((item) => (
                    <div
                      key={item.slug || item.name}
                      className="group flex min-w-[170px] snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-w-0"
                    >
                      <Link href={`/categories/${item.categorySlug}/${item.slug}`} className="relative flex h-28 items-center justify-center bg-white px-3 pt-3">
                        {item.discount > 0 && (
                          <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[10px] font-bold text-white">
                            -{item.discount}%
                          </span>
                        )}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2">
                        <Link href={`/categories/${item.categorySlug}/${item.slug}`} className="truncate text-xs font-bold text-[#0b1d45]">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-1">
                          <StarRating rating={item.rating} />
                          <span className="text-[11px] text-slate-400">
                            ({item.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-[#0b1d45]">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        </div>
                        <AddToCartButton productSlug={item.slug} name={item.name} price={item.price} image={item.image} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#0b1d45]">Order Summary</h2>
                <Link
                  href="/"
                  className="text-xs font-semibold text-[#0b75a5] hover:text-[#064d70]"
                >
                  View All Items
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {displayItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f5f7fb] p-1.5">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#0b1d45]">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {item.brand ?? item.specs?.join(" · ") ?? "Product"} · Qty: {item.qty ?? item.quantity ?? 1}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[#0b1d45]">
                      {formatPrice(Number(item.price) * Number(item.qty ?? item.quantity ?? 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({displayItems.reduce((sum, item) => sum + Number(item.qty ?? item.quantity ?? 1), 0)} items)</span>
                  <span className="font-semibold text-[#0b1d45]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping Charges</span>
                  <span className="font-semibold text-[#0b1d45]">
                    {formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-600">
                    - {formatPrice(discount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-bold text-[#0b1d45]">Total Amount</span>
                <span className="text-xl font-bold text-[#0b75a5]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}