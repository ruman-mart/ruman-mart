"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Loader2, LogOut, Mail, PackageSearch, Settings, ShoppingCart, Tags, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Categories", icon: Tags, href: "/admin/categories" },
  { label: "Products", icon: PackageSearch, href: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Inquiries", icon: Mail, href: "/admin/inquiries" },
];

type Props = {
  activeNav: string;
  sidebarOpen: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
};

export default function AdminSidebar({ activeNav, sidebarOpen, onClose, onSelect }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo-web.webp");
  const [adminName, setAdminName] = useState("Ruman Admin");

  useEffect(() => {
    void fetch("/api/settings/shipping", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as { logoUrl?: string } : null)
      .then((settings) => setLogoUrl(settings?.logoUrl || "/logo-web.webp"))
      .catch(() => setLogoUrl("/logo-web.webp"));
    void fetch("/api/auth/profile", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as { fullName?: string } : null)
      .then((profile) => { if (profile?.fullName) setAdminName(profile.fullName); })
      .catch(() => undefined);
  }, []);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      {sidebarOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-[#071b3d]/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden px-3 py-4 text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "linear-gradient(160deg, #173d7a 0%, #071b3d 48%, #031126 100%)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.11]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px)" }} />
        <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-white/15 text-sm font-black text-white shadow-lg">
              <img src={logoUrl} alt="Ruman Mart logo" onError={() => setLogoUrl("/logo-web.webp")} className="h-full w-full object-contain p-1" />
            </span>
            <span><span className="block text-base font-bold tracking-tight">Ruman<span className="text-[#7deaff]">Mart</span></span><span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">Admin Console</span></span>
          </Link>
          <button aria-label="Close navigation" onClick={onClose} className="rounded-xl p-2 text-white/55 hover:bg-white/10 hover:text-white lg:hidden"><X size={18} /></button>
        </div>
        <div className="relative z-10 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Workspace</div>
        <nav className="relative z-10 mt-3 flex flex-col gap-1">
          {navigation.map(({ label, icon: Icon, href }) => {
            const active = activeNav === label;
            return <Link key={label} href={href} onClick={() => { onSelect(label); onClose(); }} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${active ? "border-white/25 bg-white/20 text-white shadow-lg shadow-black/20 backdrop-blur-sm" : "border-transparent text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon size={17} strokeWidth={active ? 2.2 : 1.8} /> <span className="font-medium tracking-wide">{label}</span></Link>;
          })}
        </nav>
        <div className="relative z-10 mt-auto space-y-2 rounded-2xl border border-white/10 bg-black/10 p-2">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Account</p>
          <Link href="/admin/settings" onClick={() => { onSelect("Settings"); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${activeNav === "Settings" ? "border-white/25 bg-white/20 text-white" : "border-transparent text-white/65 hover:bg-white/10 hover:text-white"}`}><Settings size={17} />Settings</Link>
          <button disabled={loggingOut} onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-rose-100/80 transition-all hover:border-rose-300/20 hover:bg-rose-500/15 hover:text-rose-50 disabled:cursor-wait disabled:opacity-60">{loggingOut ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />}{loggingOut ? "Logging out..." : "Log out"}</button>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6c453] text-sm font-black text-[#071b3d]">RM</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{adminName}</p><p className="text-xs text-white/45">Super Admin</p></div><ChevronDown size={15} className="ml-auto text-white/35" /></div>
        </div>
      </aside>
    </>
  );
}
