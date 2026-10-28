"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Loader2, ShoppingCart, Trash2, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import Pagination from "../components/Pagination";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  id?: string;
  productSlug?: string;
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
  customerId?: number | null;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string | null;
  country?: string;
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
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

function formatPrice(price: number) {
  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
}

function paymentMethodLabel(value?: string) {
  if (value === "cod") return "Cash on Delivery";
  if (value === "advance-shipping") return "Shipping Advance";
  if (!value) return "Not provided";
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = visibleOrders.slice((safePage - 1) * pageSize, safePage * pageSize);

  async function updateStatus(id: number, status: OrderStatus) {
    if (updatingOrderId !== null) return;
    setUpdatingOrderId(id);
    const response = await fetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setUpdatingOrderId(null);
  }

  async function deleteOrder() {
    if (!deleteTarget || deletingOrderId !== null) return;
    setDeletingOrderId(deleteTarget.id);
    const response = await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    if (response.ok) {
      setOrders((current) => current.filter((order) => order.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSelectedOrder(null);
    }
    setDeletingOrderId(null);
  }

  const selectedItems = selectedOrder ? parseOrderItems(selectedOrder.items) : [];

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[260px]">
        <AdminSidebar activeNav="Orders" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={() => undefined} />
        <AdminHeader query={query} onQueryChange={setQuery} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mb-8">
            <Link href="/ruman-admin-hub" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]">
              <ArrowLeft size={15} /> Dashboard
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Order management</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0b1d45] sm:text-3xl">Orders</h1>
            <p className="mt-2 text-sm text-slate-500">All orders placed by customers are listed here.</p>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-[#0b1d45]">All orders <span className="ml-1 text-sm font-normal text-slate-400">{orders.length}</span></h2>
            </div>
            {loading ? (
              <p className="p-10 text-center text-sm text-slate-500">Loading orders...</p>
            ) : visibleOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center sm:p-14">
                <ShoppingCart size={32} className="text-slate-300" />
                <p className="font-semibold text-[#0b1d45]">No orders found</p>
                <p className="text-sm text-slate-500">Orders placed from checkout will appear here.</p>
              </div>
            ) : (
              <>
              <div className="divide-y divide-slate-100 2xl:hidden">
                {paginatedOrders.map((order) => {
                  const items = parseOrderItems(order.items);
                  const firstItem = items[0];

                  return (
                    <article key={order.id} className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <button type="button" onClick={() => setSelectedOrder(order)} className="min-w-0 text-left">
                          <span className="block truncate text-sm font-bold text-[#0b1d45]">{order.orderNumber}</span>
                          <span className="mt-1 block truncate text-sm font-semibold text-slate-700">{order.customerName}</span>
                          <span className="mt-0.5 block break-all text-xs text-slate-500">{order.email}</span>
                        </button>
                        <button type="button" aria-label={`Delete ${order.orderNumber}`} onClick={() => setDeleteTarget(order)} className="shrink-0 rounded-lg p-2 text-rose-500 hover:bg-rose-50">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <button type="button" onClick={() => setSelectedOrder(order)} className="mt-4 flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left">
                        {firstItem?.image ? (
                          <img src={firstItem.image} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover" />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-400 ring-1 ring-slate-200">P</span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-700">{firstItem?.name || "No product details"}</span>
                          <span className="mt-0.5 block text-xs text-slate-400">
                            {firstItem ? `Qty ${Number(firstItem.quantity ?? firstItem.qty ?? 1)}` : "Tap to view order"}
                            {items.length > 1 ? ` · +${items.length - 1} more` : ""}
                          </span>
                        </span>
                        <ChevronRight size={16} className="shrink-0 text-slate-400" />
                      </button>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="text-slate-400">Location</p>
                          <p className="mt-1 truncate font-medium text-slate-700">{[order.city, order.province].filter(Boolean).join(", ") || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Date</p>
                          <p className="mt-1 font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Amount</p>
                          <p className="mt-1 font-bold text-[#0b1d45]">{formatPrice(order.total)}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-slate-400">Status</p>
                          <span className="inline-flex items-center gap-1">
                            <select aria-label={`Status for ${order.orderNumber}`} disabled={updatingOrderId !== null} value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} className={`max-w-full rounded-full border-0 px-2.5 py-1 text-[11px] font-bold outline-none disabled:cursor-wait disabled:opacity-60 ${statusStyles[order.status]}`}>
                              <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                            </select>
                            {updatingOrderId === order.id && <Loader2 size={13} className="animate-spin text-slate-400" />}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="hidden 2xl:block">
                <table className="w-full table-fixed text-left">
                  <colgroup>
                    <col className="w-[13%]" />
                    <col className="w-[28%]" />
                    <col className="w-[17%]" />
                    <col className="w-[17%]" />
                    <col className="w-[11%]" />
                    <col className="w-[11%]" />
                    <col className="w-[3%]" />
                  </colgroup>
                  <thead className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-2 py-3 sm:px-3">Order ID</th>
                      <th className="px-2 py-3 sm:px-3">Customer</th>
                      <th className="px-2 py-3 sm:px-3">Location</th>
                      <th className="px-2 py-3 sm:px-3">Date</th>
                      <th className="px-2 py-3 sm:px-3">Amount</th>
                      <th className="px-2 py-3 sm:px-3">Status</th>
                      <th className="px-2 py-3 sm:px-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedOrders.map((order) => {
                      return (
                        <tr
                          key={order.id}
                          className="cursor-pointer text-sm hover:bg-slate-50/70"
                          onClick={(event) => {
                            if ((event.target as HTMLElement).closest("select")) return;
                            setSelectedOrder(order);
                          }}
                        >
                          <td className="whitespace-nowrap px-2 py-4 text-xs font-bold text-[#0b1d45] sm:px-3 sm:text-sm">{order.orderNumber}</td>
                          <td className="min-w-0 px-2 py-4 sm:px-3"><p className="truncate font-semibold text-slate-700">{order.customerName}</p><p className="mt-0.5 break-all text-[11px] text-slate-400">{order.email} · {order.phone}</p></td>
                          <td className="px-2 py-4 text-xs text-slate-500 sm:px-3"><span className="block truncate">{[order.city, order.province].filter(Boolean).join(", ") || "Not provided"}</span></td>
                          <td className="whitespace-nowrap px-2 py-4 text-[11px] text-slate-500 sm:px-3 sm:text-xs">{new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                          <td className="whitespace-nowrap px-2 py-4 text-xs font-semibold text-slate-700 sm:px-3 sm:text-sm">Rs. {Number(order.total).toLocaleString("en-PK")}</td>
                          <td className="px-2 py-4 sm:px-3"><span className="inline-flex max-w-full items-center gap-1"><select aria-label={`Status for ${order.orderNumber}`} disabled={updatingOrderId !== null} value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} className={`max-w-full rounded-full border-0 px-1.5 py-1 text-[10px] font-bold outline-none disabled:cursor-wait disabled:opacity-60 sm:px-2 sm:text-[11px] ${statusStyles[order.status]}`}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select>{updatingOrderId === order.id && <Loader2 size={13} className="animate-spin text-slate-400" />}</span></td>
                          <td className="px-1 py-4 sm:px-2"><div className="flex items-center justify-center"><button type="button" aria-label={`Delete ${order.orderNumber}`} onClick={(event) => { event.stopPropagation(); setDeleteTarget(order); }} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 size={15} /></button></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </>
            )}
            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </section>
        </main>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Trash2 size={19} /></span><div><h2 className="text-lg font-bold text-[#0b1d45]">Delete order?</h2><p className="mt-1 text-sm text-slate-500">This will permanently delete <span className="font-semibold text-slate-700">{deleteTarget.orderNumber}</span>.</p></div></div>
            <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none">Cancel</button><button type="button" onClick={() => void deleteOrder()} disabled={deletingOrderId !== null} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60 sm:flex-none">{deletingOrderId !== null ? "Deleting..." : "Delete order"}</button></div>
          </div>
        </div>
      ) : null}

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl min-w-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/20 sm:max-h-[90vh] sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap sm:gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Order details</p>
                <h2 id="order-details-title" className="mt-1 text-2xl font-bold text-[#0b1d45]">{selectedOrder.orderNumber}</h2>
                <p className="mt-1 text-sm text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[selectedOrder.status]}`}>{selectedOrder.status}</span>
                <button type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)} className="rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Customer</h3>
                <p className="mt-2 font-semibold text-slate-800">{selectedOrder.customerName}</p>
                <p className="mt-1 break-all text-sm text-slate-500">{selectedOrder.email}</p>
                <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
                {selectedOrder.customerId != null ? <p className="mt-2 text-xs text-slate-400">Customer ID: {selectedOrder.customerId}</p> : null}
              </section>
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Shipping address</h3>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selectedOrder.address || "Address not provided"}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {[selectedOrder.city, selectedOrder.province, selectedOrder.postalCode].filter(Boolean).join(", ") || "Location not provided"}
                </p>
                <p className="text-sm text-slate-500">{selectedOrder.country || "Country not provided"}</p>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Order information</h3>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-400">Order number</dt><dd className="mt-0.5 font-semibold text-slate-700">{selectedOrder.orderNumber}</dd></div>
                  <div><dt className="text-slate-400">Payment method</dt><dd className="mt-0.5 font-semibold text-slate-700">{paymentMethodLabel(selectedOrder.paymentMethod)}</dd></div>
                </dl>
              </section>
            </div>

            <section>
              <h3 className="mb-3 text-sm font-bold text-[#0b1d45]">Products ({selectedItems.length})</h3>
              <div className="space-y-3">
                {selectedItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">No product details saved for this order.</p>
                ) : (
                  selectedItems.map((item, index) => {
                    const itemQty = Number(item.quantity ?? item.qty ?? 1);
                    const itemSpecs = Array.isArray(item.specs) ? item.specs.filter(Boolean) : [];
                    const unitPrice = Number(item.price ?? 0);

                    return (
                      <div key={`${selectedOrder.id}-${item.name}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-3 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                          {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <span className="text-xs font-bold text-slate-500">IMG</span>}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-base font-bold text-[#0b1d45]">{item.name}</p>
                            <p className="text-sm font-semibold text-slate-700">{formatPrice(unitPrice * itemQty)}</p>
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

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Qty: {itemQty}</span>
                            <span>Unit price: {formatPrice(unitPrice)}</span>
                            {item.id ? <span>Product ID: {item.id}</span> : null}
                            {item.productSlug ? <span>Slug: {item.productSlug}</span> : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-[#0b1d45]">Payment summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4 text-slate-600"><dt>Subtotal</dt><dd>{formatPrice(Number(selectedOrder.subtotal ?? 0))}</dd></div>
                <div className="flex justify-between gap-4 text-slate-600"><dt>Shipping</dt><dd>{formatPrice(Number(selectedOrder.shippingCost ?? 0))}</dd></div>
                <div className="flex justify-between gap-4 text-slate-600"><dt>Discount</dt><dd>-{formatPrice(Number(selectedOrder.discount ?? 0))}</dd></div>
                <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 font-bold text-[#0b1d45]"><dt>Order total</dt><dd>{formatPrice(Number(selectedOrder.total))}</dd></div>
              </dl>
            </section>
          </section>
        </div>
      ) : null}
    </div>
  );
}
