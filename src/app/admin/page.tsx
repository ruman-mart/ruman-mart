"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  PackageSearch,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  initials: string;
  date: string;
  amount: string;
  status: OrderStatus;
  total: number;
  email?: string;
  createdAt?: string;
  items?: unknown;
};

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Resolved";
  createdAt: string;
};

type ProductStat = {
  name: string;
  sold: number;
  value: number;
  image: string;
};

function formatCurrency(value: number) {
  return `Rs. ${Number(value).toLocaleString("en-PK")}`;
}

function parseOrderItems(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-sky-50 text-sky-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

function StatCard({ title, value, change, icon: Icon, tone }: { title: string; value: string; change: string; icon: typeof Users; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#0b1d45]">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <TrendingUp size={13} /> {change} <span className="font-normal text-slate-400">from last month</span>
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [period, setPeriod] = useState("Last 30 days");
  const [query, setQuery] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    void fetch("/api/orders")
      .then(async (response) => {
        if (!response.ok) return [];
        return await response.json() as Array<{
          orderNumber: string;
          customerName: string;
          email?: string;
          createdAt: string;
          total: number;
          status: OrderStatus;
          items?: unknown;
        }>;
      })
      .then((savedOrders) => {
        const normalizedOrders = savedOrders.map((order) => ({
          id: order.orderNumber,
          customer: order.customerName,
          initials: order.customerName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          date: new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }),
          amount: formatCurrency(Number(order.total)),
          status: order.status,
          total: Number(order.total),
          email: order.email,
          createdAt: order.createdAt,
          items: order.items,
        }));

        setOrders(normalizedOrders);
      })
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    void fetch("/api/inquiries", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as Inquiry[] : [])
      .then(setInquiries)
      .catch(() => setInquiries([]));
  }, []);

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between p-5 sm:p-6"><div><h2 className="font-bold text-[#0b1d45]">Customer inquiries</h2><p className="mt-1 text-xs text-slate-400">Messages submitted through the contact form</p></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-[#0b75a5]">{inquiries.filter((inquiry) => inquiry.status === "New").length} new</span></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Message</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{inquiries.slice(0, 10).map((inquiry) => <tr key={inquiry.id} className="text-sm hover:bg-slate-50/70"><td className="px-6 py-4"><p className="font-semibold text-slate-700">{inquiry.name}</p><p className="text-xs text-slate-400">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p></td><td className="px-6 py-4 font-semibold text-[#0b1d45]">{inquiry.subject}</td><td className="max-w-xs px-6 py-4 text-xs text-slate-500"><p className="truncate">{inquiry.message}</p></td><td className="px-6 py-4 text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${inquiry.status === "New" ? "bg-cyan-50 text-[#0b75a5]" : inquiry.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{inquiry.status}</span></td></tr>)}{inquiries.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">No inquiries yet.</td></tr>}</tbody></table></div></section>

  const topProducts = useMemo(() => {
    const productMap = new Map<string, ProductStat>();

    for (const order of orders) {
      const items = parseOrderItems((order as unknown as { items?: unknown }).items);
      for (const item of items) {
        const itemRecord = item as {
          name?: string;
          quantity?: number | string;
          qty?: number | string;
          price?: number | string;
          image?: string;
        };

        const name = String(itemRecord.name ?? "Product");
        const quantity = Number(itemRecord.quantity ?? itemRecord.qty ?? 1);
        const price = Number(itemRecord.price ?? 0);
        const image = String(itemRecord.image ?? "");
        const existing = productMap.get(name) ?? { name, sold: 0, value: 0, image };

        existing.sold += Number.isFinite(quantity) ? quantity : 1;
        existing.value += Number.isFinite(price) ? quantity * price : 0;
        existing.image = image || existing.image;
        productMap.set(name, existing);
      }
    }

    return Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold || b.value - a.value)
      .slice(0, 3)
      .map((product) => ({
        name: product.name,
        sold: `${product.sold} sold`,
        value: formatCurrency(product.value),
        image: product.image || "/products/placeholder.png",
      }));
  }, [orders]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const totalCustomers = new Set(orders.map((order) => order.email || order.customer).filter(Boolean)).size;
  const productsSold = orders.reduce((sum, order) => {
    const items = parseOrderItems((order as unknown as { items?: unknown }).items);
    return sum + items.reduce((itemTotal, item) => {
      const itemRecord = item as { quantity?: number | string; qty?: number | string };
      return itemTotal + Number(itemRecord.quantity ?? itemRecord.qty ?? 1);
    }, 0);
  }, 0);

  const chartValues = useMemo(() => {
    const range = period === "Last 7 days" ? 7 : period === "This year" ? 12 : 30;
    const buckets = Array.from({ length: range }, () => 0);

    for (const order of orders) {
      const timestamp = new Date(order.createdAt ?? Date.now()).getTime();
      if (Number.isNaN(timestamp)) continue;

      const diffDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays >= range) continue;

      const index = Math.max(0, range - 1 - diffDays);
      buckets[index] += Number(order.total ?? 0);
    }

    const maxValue = Math.max(...buckets, 1);
    return buckets.map((value) => Math.max(8, Math.round((value / maxValue) * 100)));
  }, [orders, period]);

  const visibleOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.status}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[260px]">
        <AdminSidebar activeNav={activeNav} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={setActiveNav} />
        <AdminHeader query={query} onQueryChange={setQuery} onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Store overview</p><h1 className="text-2xl font-bold tracking-tight text-[#0b1d45] sm:text-3xl">Dashboard</h1></div>
            <button className="flex w-fit items-center gap-2 rounded-xl bg-[#0b1d45] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-[#102d62]"><ShoppingBag size={16} /> Add new product</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} change="Live" icon={CircleDollarSign} tone="bg-cyan-50 text-[#0b75a5]" />
            <StatCard title="Total Orders" value={String(totalOrders)} change="Live" icon={ShoppingCart} tone="bg-indigo-50 text-indigo-600" />
            <StatCard title="Total Customers" value={String(totalCustomers)} change="Live" icon={Users} tone="bg-emerald-50 text-emerald-600" />
            <StatCard title="Products Sold" value={String(productsSold)} change="Live" icon={PackageSearch} tone="bg-amber-50 text-amber-600" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-[#0b1d45]">Revenue overview</h2><p className="mt-1 text-xs text-slate-400">Track your store&apos;s performance over time</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 outline-none"><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select></div>
              <div className="mt-6 flex items-end gap-3"><p className="text-2xl font-bold text-[#0b1d45]">{formatCurrency(totalRevenue)}</p><span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600"><TrendingUp size={13} /> Live</span></div>
              <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-slate-100 px-2 pb-0 sm:gap-3"><div className="flex h-full flex-col justify-between pb-2 pr-3 text-[10px] text-slate-400"><span>{period === "Last 7 days" ? "7d" : period === "This year" ? "12m" : "30d"}</span><span>50%</span><span>0</span></div><div className="relative flex h-full flex-1 items-end justify-between gap-1 bg-[linear-gradient(to_bottom,transparent_49%,#eef2f7_50%,transparent_51%)] sm:gap-2">{chartValues.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div style={{ height: `${height}%` }} className={`w-full rounded-t-md transition-all group-hover:bg-[#0b75a5] ${index === chartValues.length - 1 ? "bg-[#1fb6e6]" : "bg-[#bcecf8]"}`} /></div>)}</div></div>
              <div className="ml-12 mt-2 flex justify-between text-[10px] text-slate-400"><span>{period === "Last 7 days" ? "Mon" : period === "This year" ? "Jan" : "01"}</span><span>{period === "Last 7 days" ? "Tue" : period === "This year" ? "Mar" : "07"}</span><span>{period === "Last 7 days" ? "Wed" : period === "This year" ? "May" : "14"}</span><span>{period === "Last 7 days" ? "Thu" : period === "This year" ? "Jul" : "21"}</span><span>{period === "Last 7 days" ? "Fri" : period === "This year" ? "Sep" : "30"}</span></div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold text-[#0b1d45]">Top products</h2><p className="mt-1 text-xs text-slate-400">Best performers this month</p></div><button className="text-xs font-bold text-[#0b75a5] hover:text-[#0b1d45]">View all</button></div><div className="mt-5 flex flex-col gap-4">{topProducts.map((product, index) => <div key={product.name} className="flex items-center gap-3"><span className="w-4 text-xs font-bold text-slate-400">0{index + 1}</span><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-1.5"><img src={product.image} alt={product.name} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#0b1d45]">{product.name}</p><p className="mt-0.5 text-xs text-slate-400">{product.sold}</p></div><p className="text-right text-xs font-bold text-slate-700">{product.value}</p></div>)}</div></section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"><div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="font-bold text-[#0b1d45]">Recent orders</h2><p className="mt-1 text-xs text-slate-400">Keep track of your latest customer orders</p></div><button className="flex w-fit items-center gap-1 text-xs font-bold text-[#0b75a5] hover:text-[#0b1d45]">View all orders <ChevronRight size={14} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3 font-bold">Order ID</th><th className="px-6 py-3 font-bold">Customer</th><th className="px-6 py-3 font-bold">Date</th><th className="px-6 py-3 font-bold">Amount</th><th className="px-6 py-3 font-bold">Status</th><th className="px-6 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{visibleOrders.map((order) => <tr key={order.id} className="text-sm hover:bg-slate-50/70"><td className="px-6 py-4 font-bold text-[#0b1d45]">{order.id}</td><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6f7fc] text-[10px] font-bold text-[#0b75a5]">{order.initials}</span><span className="font-semibold text-slate-700">{order.customer}</span></div></td><td className="px-6 py-4 text-xs text-slate-500">{order.date}</td><td className="px-6 py-4 font-semibold text-slate-700">{order.amount}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[order.status]}`}>{order.status}</span></td><td className="px-6 py-4 text-right"><button aria-label={`Open ${order.id}`} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-[#0b75a5]"><ChevronRight size={17} /></button></td></tr>)}</tbody></table>{visibleOrders.length === 0 && <p className="px-6 py-10 text-center text-sm text-slate-500">No orders match your search.</p>}</div></section>
        </main>
      </div>
    </div>
  );
}