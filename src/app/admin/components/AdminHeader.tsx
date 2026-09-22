"use client";

import { Bell, Menu, Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onOpenSidebar: () => void;
};

export default function AdminHeader({ query, onQueryChange, onOpenSidebar }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
        <button aria-label="Open navigation" onClick={onOpenSidebar} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={22} /></button>
        <div className="hidden sm:block"><p className="text-sm font-semibold text-[#0b1d45]">Good morning, Ruman</p><p className="text-xs text-slate-400">Here&apos;s what&apos;s happening with your store today.</p></div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <label className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 md:flex"><Search size={16} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search orders..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></label>
          <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Bell size={19} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" /></button>
          <span className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b75a5] text-xs font-bold text-white">RM</div>
        </div>
      </div>
    </header>
  );
}
