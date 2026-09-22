"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, ChevronDown, LayoutDashboard, LogOut, PackageSearch, Settings, ShoppingCart, Tags, Users, X } from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Categories", icon: Tags, href: "/admin/categories" },
      { label: "Products", icon: PackageSearch, href: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },


 
 
];

type Props = {
  activeNav: string;
  sidebarOpen: boolean;
  onClose: () => void;
  onSelect: (label: string) => void;
};

export default function AdminSidebar({ activeNav, sidebarOpen, onClose, onSelect }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      {sidebarOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-[#071b3d]/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[#071b3d] px-4 py-5 text-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3">
          <Link href="/admin" className="text-xl font-bold tracking-tight">Ruman<span className="text-[#1fb6e6]">Mart</span><span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Console</span></Link>
          <button aria-label="Close navigation" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"><X size={19} /></button>
        </div>
        <div className="mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
        <nav className="mt-3 flex flex-col gap-1">
          {navigation.map(({ label, icon: Icon, href }) => {
            const active = activeNav === label;
            return <Link key={label} href={href} onClick={() => { onSelect(label); onClose(); }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-[#1fb6e6] text-white shadow-lg shadow-cyan-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={18} strokeWidth={active ? 2.2 : 1.8} />{label}{label === "Inventory" && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-400">4</span>}</Link>;
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <Link href="/admin/settings" onClick={() => { onSelect("Settings"); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${activeNav === "Settings" ? "bg-[#1fb6e6] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Settings size={18} />Settings</Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-200 hover:bg-rose-400/10 hover:text-rose-100"><LogOut size={18} />Log out</button>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6c453] text-sm font-bold text-[#071b3d]">RM</span><div className="min-w-0"><p className="truncate text-sm font-semibold">Ruman Admin</p><p className="text-xs text-slate-400">Super Admin</p></div><ChevronDown size={15} className="ml-auto text-slate-500" /></div>
        </div>
      </aside>
    </>
  );
}
