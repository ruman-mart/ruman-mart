"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ShoppingCart, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  id?: string;
  name: string;
  image?: string;
  price?: number;
  quantity?: number;
  qty?: number;
  specs?: string[];
};

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items?: string | OrderItem[];
};

function parseOrderItems(value?: string | OrderItem[]) {
  if (!value) return [] as OrderItem[];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed as OrderItem[] : [];
  } catch {
    return [] as OrderItem[];
  }
}

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-sky-50 text-sky-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    void fetch("/api/orders")
      .then(async (response) => response.ok ? await response.json() as Order[] : [])
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleOrders = orders.filter((order) =>
    `${order.orderNumber} ${order.customerName} ${order.email} ${order.status}`.toLowerCase().includes(query.toLowerCase()),
  );

  async function updateStatus(id: number, status: OrderStatus) {
    const response = await fetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) return;
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  }

  const selectedItems = selectedOrder ? parseOrderItems(selectedOrder.items) : [];

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[248px]">
        <AdminSidebar activeNav="Orders" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={() => undefined} />
        <AdminHeader query={query} onQueryChange={setQuery} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mb-8">
            <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]">
              <ArrowLeft size={15} /> Dashboard
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Order management</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">All orders placed by customers are listed here.</p>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-[#0b1d45]">All orders <span className="ml-1 text-sm font-normal text-slate-400">{orders.length}</span></h2>
            </div>
            {loading ? (
              <p className="p-10 text-center text-sm text-slate-500">Loading orders...</p>
            ) : visibleOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-14 text-center">
                <ShoppingCart size={32} className="text-slate-300" />
                <p className="font-semibold text-[#0b1d45]">No orders found</p>
                <p className="text-sm text-slate-500">Orders placed from checkout will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Products</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleOrders.map((order) => {
                      const productItems = parseOrderItems(order.items).slice(0, 3);
                      const remainingProducts = Math.max(0, parseOrderItems(order.items).length - productItems.length);

                      return (
                        <tr
                          key={order.id}
                          className="cursor-pointer text-sm hover:bg-slate-50/70"
                          onClick={(event) => {
                            if ((event.target as HTMLElement).closest("select")) return;
                            setSelectedOrder(order);
                          }}
                        >
                          <td className="px-6 py-4 font-bold text-[#0b1d45]">{order.orderNumber}</td>
                          <td className="px-6 py-4"><p className="font-semibold text-slate-700">{order.customerName}</p><p className="mt-0.5 text-xs text-slate-400">{order.email} · {order.phone}</p></td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {productItems.map((item, index) => (
                                <div key={`${order.id}-${item.name}-${index}`} className="flex items-center gap-2.5">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-8 w-8 rounded-md border border-slate-200 object-cover" />
                                  ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">P</span>
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-slate-700">{item.name}</p>
                                    <p className="text-[11px] text-slate-400">Qty {Number(item.quantity ?? item.qty ?? 1)}</p>
                                  </div>
                                </div>
                              ))}
                              {remainingProducts > 0 ? <p className="text-[11px] font-medium text-slate-400">+{remainingProducts} more</p> : null}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{order.city}, {order.province}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">Rs. {Number(order.total).toLocaleString("en-PK")}</td>
                          <td className="px-6 py-4"><select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-bold outline-none ${statusStyles[order.status]}`}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td>
                          <td className="px-6 py-4 text-right"><ChevronRight size={17} className="text-slate-400" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Order details</p>
                <h2 className="mt-1 text-2xl font-bold text-[#0b1d45]">{selectedOrder.orderNumber}</h2>
              </div>
              <button type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)} className="rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Customer</p>
                <p className="mt-2 font-semibold text-slate-800">{selectedOrder.customerName}</p>
                <p className="text-sm text-slate-500">{selectedOrder.email}</p>
                <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Shipping</p>
                <p className="mt-2 text-sm text-slate-700">{selectedOrder.city}, {selectedOrder.province}</p>
                <p className="text-sm text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedItems.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">No product details saved for this order.</p>
              ) : (
                selectedItems.map((item, index) => {
                  const itemQty = Number(item.quantity ?? item.qty ?? 1);
                  const itemSpecs = Array.isArray(item.specs) ? item.specs.filter(Boolean) : [];
                  const unitPrice = Number(item.price ?? 0);

                  return (
                    <div key={`${selectedOrder.id}-${item.name}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-3 sm:flex-row sm:items-center">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                        {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-500">IMG</span>}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-base font-bold text-[#0b1d45]">{item.name}</p>
                          <p className="text-sm font-semibold text-slate-700">Rs. {Number(unitPrice * itemQty).toLocaleString("en-PK")}</p>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {itemSpecs.length > 0 ? itemSpecs.map((spec) => (
                            <span key={`${item.name}-${spec}`} className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-[#0b75a5]">
                              {spec}
                            </span>
                          )) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">No variant details</span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>Qty: {itemQty}</span>
                          <span>Unit price: Rs. {Number(unitPrice).toLocaleString("en-PK")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-600">Order total</span>
              <span className="text-xl font-bold text-[#0b1d45]">Rs. {Number(selectedOrder.total).toLocaleString("en-PK")}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
