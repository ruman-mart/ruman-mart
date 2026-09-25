"use client";

import { Bell, CheckCircle2, Clock3, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onOpenSidebar: () => void;
  searchPlaceholder?: string;
};

type NotificationOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
};

function getGreeting() {
  const hourText = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    hour12: false,
  }).format(new Date());
  const hour = Number(hourText) === 24 ? 0 : Number(hourText);
  if (hour >= 18 || hour < 5) return "Good night";
  return hour < 12 ? "Good morning" : "Good afternoon";
}

export default function AdminHeader({ query, onQueryChange, onOpenSidebar, searchPlaceholder = "Search orders..." }: Props) {
  const [orders, setOrders] = useState<NotificationOrder[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();
    const interval = window.setInterval(updateGreeting, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    void fetch("/api/auth/profile", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as { avatarUrl?: string } : null)
      .then((profile) => setAvatarUrl(profile?.avatarUrl ?? ""))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    function closeNotifications(event: MouseEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setNotificationsOpen(false);
    }

    document.addEventListener("mousedown", closeNotifications);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", closeNotifications);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) return;
      const savedOrders = await response.json() as NotificationOrder[];
      if (mounted) setOrders(savedOrders.slice(0, 5));
    };

    void loadNotifications().catch(() => undefined);
    const interval = window.setInterval(() => {
      void loadNotifications().catch(() => undefined);
    }, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const pendingCount = orders.filter((order) => order.status === "Processing").length;
  const formatCurrency = (value: number) => `Rs. ${Number(value).toLocaleString("en-PK")}`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
        <button aria-label="Open navigation" onClick={onOpenSidebar} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={22} /></button>
        <div className="hidden sm:block"><p className="text-sm font-semibold text-[#0b1d45]">{greeting}, Ruman</p><p className="text-xs text-slate-400">Here&apos;s what&apos;s happening with your store today.</p></div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <label className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 md:flex"><Search size={16} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></label>
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={19} />
              {pendingCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{pendingCount > 9 ? "9+" : pendingCount}</span>}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div><h2 className="text-sm font-bold text-[#0b1d45]">Notifications</h2><p className="text-[11px] text-slate-400">Latest order activity</p></div>
                  <button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
                </div>
                {orders.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400"><CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={22} />No new order notifications</div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {orders.map((order) => (
                      <div key={order.id} className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50">
                        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${order.status === "Processing" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}><Clock3 size={14} /></span>
                        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#0b1d45]">New order {order.orderNumber}</p><p className="truncate text-[11px] text-slate-500">{order.customerName} · {formatCurrency(order.total)}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })} · {order.status}</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#0b75a5] text-xs font-bold text-white">{avatarUrl ? <img src={avatarUrl} alt="Admin profile" className="h-full w-full object-cover" /> : "RM"}</div>
        </div>
      </div>
    </header>
  );
}
