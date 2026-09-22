"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Home as HomeIcon,
  MapPin,
  CreditCard,
  Headset,
  PackageCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type OrderItem = {
  name: string;
  specs?: string[];
  brand?: string;
  qty?: number;
  quantity?: number;
  price: number;
  image: string;
};

type OrderRecord = {
  id?: number;
  orderNumber: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  items?: string | OrderItem[];
  subtotal?: number | string;
  shippingCost?: number | string;
  discount?: number | string;
  total?: number | string;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
};

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

function normalizeOrderNumber(value: string) {
  return String(value ?? "").replace(/^#/, "").replace(/\s+/g, "").toLowerCase();
}

function paymentMethodLabel(value?: string) {
  switch (value) {
    case "advance-shipping":
      return "Shipping Advance";
    case "cod":
      return "Cash on Delivery";
    case "cash-on-delivery":
      return "Cash on Delivery";
    case "card":
      return "Card Payment";
    default:
      return value ? value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Cash on Delivery";
  }
}

export default function OrderDetailsPage() {
  const params = useParams<{ orderId?: string }>();
  const routeOrderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId ?? "";
  const normalizedRouteId = normalizeOrderNumber(routeOrderId);

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(normalizedRouteId));
  const [error, setError] = useState(normalizedRouteId ? "" : "No order selected.");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      setLoading(true);
      setError("");

      try {
        const savedOrder = sessionStorage.getItem("ruman-last-order");
        if (savedOrder) {
          const parsed = JSON.parse(savedOrder) as Partial<OrderSnapshot>;
          const snapshotOrderNumber = normalizeOrderNumber(parsed.orderNumber ?? "");
          if (snapshotOrderNumber && normalizedRouteId && snapshotOrderNumber === normalizedRouteId) {
            const snapshotOrder: OrderRecord = {
              orderNumber: parsed.orderNumber ?? routeOrderId,
              customerName: "Customer",
              phone: "",
              email: "",
              address: "",
              province: "",
              city: "",
              postalCode: "",
              country: "Pakistan",
              items: parsed.items ?? [],
              subtotal: Number(parsed.subtotal ?? 0),
              shippingCost: Number(parsed.shippingCost ?? 0),
              discount: Number(parsed.discount ?? 0),
              total: Number(parsed.total ?? 0),
              paymentMethod: parsed.paymentMethod ?? "cod",
              createdAt: parsed.orderDate ?? new Date().toISOString(),
            };
            if (isMounted) {
              setOrder(snapshotOrder);
              setLoading(false);
              return;
            }
          }
        }

        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const orders = (await response.json()) as OrderRecord[];
        const matched = orders.find((entry) => normalizeOrderNumber(entry.orderNumber ?? "") === normalizedRouteId) ?? null;

        if (isMounted) {
          setOrder(matched);
          setLoading(false);
          if (!matched) {
            setError("We could not find this order.");
          }
        }
      } catch {
        if (isMounted) {
          setOrder(null);
          setLoading(false);
          setError("We could not load your order details right now.");
        }
      }
    }

    if (!normalizedRouteId) {
      return () => {
        isMounted = false;
      };
    }

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [normalizedRouteId, routeOrderId]);

  const orderItems = useMemo(() => {
    if (!order?.items) return [] as OrderItem[];

    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string || "[]");

    return (Array.isArray(items) ? items : []).map((item) => ({
      name: String(item.name ?? "Product"),
      specs: Array.isArray(item.specs) ? item.specs : [],
      brand: item.brand ?? item.specs?.join(" ") ?? "Product",
      qty: Number(item.quantity ?? item.qty ?? 1),
      quantity: Number(item.quantity ?? item.qty ?? 1),
      price: Number(item.price ?? 0),
      image: String(item.image ?? ""),
    }));
  }, [order]);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * (item.qty ?? item.quantity ?? 1), 0);
  const shipping = Number(order?.shippingCost ?? 0);
  const discount = Number(order?.discount ?? 0);
  const total = Number(order?.total ?? subtotal + shipping - discount);
  const orderNumber = order?.orderNumber ? `#${order.orderNumber}` : `#${routeOrderId}`;
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : "Recently";
  const customerName = order?.customerName || "Customer";
  const customerPhone = order?.phone || "-";
  const customerEmail = order?.email || "-";
  const shippingAddress = order?.address || "Address not available";
  const shippingCity = [order?.city, order?.postalCode].filter(Boolean).join(", ") || "City not available";
  const shippingCountry = order?.country || "Pakistan";
  const shippingMethod = shipping > 0 ? "Standard Shipping" : "Shipping Advance";

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f7fb] font-sans text-slate-800">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 shadow-sm">
            Loading order details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f7fb] font-sans text-slate-800">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <PackageCheck className="mx-auto mb-4 text-[#0b75a5]" size={38} />
            <h1 className="text-2xl font-bold text-[#0b1d45]">Order not found</h1>
            <p className="mt-2 text-sm text-slate-500">
              {error || "This order is unavailable right now."}
            </p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#19c9ee] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0db4d8]">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-8">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Link href="/" className="flex items-center gap-1 hover:text-[#0b75a5]">
                <HomeIcon size={14} aria-hidden="true" />
                Home
              </Link>
              <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
              <span className="font-semibold text-[#0b1d45]">{orderNumber}</span>
            </div>

            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0b75a5]">
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Shopping
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-[#0b1d45] sm:text-2xl">
                  Order {orderNumber}
                </h1>
              </div>
              <p className="mt-1 text-sm text-slate-500">Placed on {orderDate}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#0b75a5]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0b1d45]">Shipping Address</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#0b1d45]">{customerName}</p>
                  <p className="mt-1 text-sm text-slate-500">{shippingAddress}</p>
                  <p className="text-sm text-slate-500">{shippingCity}</p>
                  <p className="text-sm text-slate-500">{shippingCountry}</p>
                  <p className="mt-2 text-xs text-slate-400">{customerPhone}</p>
                  <p className="text-xs text-slate-400">{customerEmail}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#0b75a5]" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-[#0b1d45]">Payment & Shipping</h3>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Payment Method</span>
                      <span className="font-semibold text-[#0b1d45]">{paymentMethodLabel(order?.paymentMethod)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Shipping Method</span>
                      <span className="text-right font-semibold text-[#0b1d45]">{shippingMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Order Number</span>
                      <span className="font-semibold text-[#0b1d45]">{orderNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-bold text-[#0b1d45]">Items ({orderItems.length})</h2>
                </div>
                <div className="flex flex-col divide-y divide-slate-100">
                  {orderItems.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f5f7fb] p-2">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                        ) : (
                          <PackageCheck size={22} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#0b1d45]">{item.name}</p>
                        <p className="truncate text-xs text-slate-500">{item.brand || item.specs?.join(" ") || "Product"}</p>
                        <p className="mt-1 text-xs text-slate-400">Qty: {item.qty ?? item.quantity ?? 1}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#0b1d45]">
                        {formatPrice((item.price ?? 0) * (item.qty ?? item.quantity ?? 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-[#0b1d45]">Order Summary</h2>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal ({orderItems.length} items)</span>
                    <span className="font-semibold text-[#0b1d45]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-[#0b1d45]">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600">- {formatPrice(discount)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm font-bold text-[#0b1d45]">Total Amount</span>
                  <span className="text-xl font-bold text-[#0b75a5]">{formatPrice(total)}</span>
                </div>

                <Link href="/" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#19c9ee] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0db4d8]">
                  Continue Shopping
                </Link>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e6f7fc] text-[#0b75a5]">
                    <Headset size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#0b1d45]">Need Help?</p>
                    <p className="text-xs text-slate-500">Contact our support team for any questions.</p>
                  </div>
                </div>
                <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-[#0b1d45] transition-colors hover:bg-slate-50">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}