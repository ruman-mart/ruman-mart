"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2, Mail, Trash2, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import Pagination from "../components/Pagination";

type InquiryStatus = "New" | "Read" | "Resolved";
type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

const statusStyles: Record<InquiryStatus, string> = {
  New: "bg-cyan-50 text-[#0b75a5]",
  Read: "bg-slate-100 text-slate-600",
  Resolved: "bg-emerald-50 text-emerald-700",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  async function loadInquiries() {
    const response = await fetch("/api/inquiries", { cache: "no-store" });
    if (response.ok) setInquiries(await response.json() as Inquiry[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadInquiries().catch(() => setLoading(false));
  }, []);

  const filteredInquiries = useMemo(() => inquiries.filter((inquiry) => `${inquiry.name} ${inquiry.email} ${inquiry.subject} ${inquiry.status}`.toLowerCase().includes(query.toLowerCase())), [inquiries, query]);
  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleInquiries = filteredInquiries.slice((safePage - 1) * pageSize, safePage * pageSize);

  async function updateStatus(id: number, status: InquiryStatus) {
    if (updatingId !== null) return;
    setUpdatingId(id);
    const response = await fetch("/api/inquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setInquiries((current) => current.map((inquiry) => inquiry.id === id ? { ...inquiry, status } : inquiry));
    setUpdatingId(null);
  }

  async function deleteInquiry() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    const response = await fetch("/api/inquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteTarget.id }) });
    if (response.ok) {
      setInquiries((current) => current.filter((inquiry) => inquiry.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDeleting(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[260px]">
        <AdminSidebar activeNav="Inquiries" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={() => undefined} />
        <AdminHeader query={query} onQueryChange={setQuery} searchPlaceholder="Search inquiries..." onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <Link href="/ruman-admin-hub" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]"><ArrowLeft size={15} /> Dashboard</Link>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Customer communication</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">Inquiries</h1><p className="mt-2 text-sm text-slate-500">Manage messages submitted through the contact form.</p></div><div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm"><span className="text-[#0b75a5]">{inquiries.filter((inquiry) => inquiry.status === "New").length}</span> new inquiries</div></div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading ? <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><Loader2 size={17} className="animate-spin" /> Loading inquiries...</div> : visibleInquiries.length === 0 ? <div className="flex flex-col items-center gap-3 p-14 text-center"><Mail size={32} className="text-slate-300" /><p className="font-semibold text-[#0b1d45]">No inquiries found</p><p className="text-sm text-slate-500">Contact form messages will appear here.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left"><thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Message</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Status</th><th className="px-6 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{visibleInquiries.map((inquiry) => <tr key={inquiry.id} className="text-sm hover:bg-slate-50/70"><td className="px-6 py-4"><p className="font-semibold text-slate-700">{inquiry.name}</p><p className="text-xs text-slate-400">{inquiry.email}</p>{inquiry.phone && <p className="text-xs text-slate-400">{inquiry.phone}</p>}</td><td className="px-6 py-4 font-semibold text-[#0b1d45]">{inquiry.subject}</td><td className="max-w-xs px-6 py-4"><button type="button" onClick={() => setSelected(inquiry)} className="block max-w-xs truncate text-left text-xs text-slate-500 hover:text-[#0b75a5]">{inquiry.message}</button></td><td className="px-6 py-4 text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td><td className="px-6 py-4"><span className="relative inline-flex items-center"><select disabled={updatingId !== null} value={inquiry.status} onChange={(event) => void updateStatus(inquiry.id, event.target.value as InquiryStatus)} className={`appearance-none rounded-full border-0 py-1 pl-2.5 pr-7 text-[11px] font-bold outline-none disabled:cursor-wait disabled:opacity-60 ${statusStyles[inquiry.status]}`}><option>New</option><option>Read</option><option>Resolved</option></select><ChevronDown size={12} className="pointer-events-none absolute right-2" />{updatingId === inquiry.id && <Loader2 size={12} className="ml-2 animate-spin text-slate-400" />}</span></td><td className="px-6 py-4 text-right"><button type="button" onClick={() => setDeleteTarget(inquiry)} aria-label={`Delete inquiry from ${inquiry.name}`} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>}
          </section>
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </main>
      </div>
      {selected && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071b3d]/50 p-4"><section role="dialog" aria-modal="true" className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-[#0b75a5]">{selected.subject}</p><h2 className="mt-1 text-xl font-bold text-[#0b1d45]">{selected.name}</h2><p className="text-sm text-slate-500">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p></div><button type="button" aria-label="Close inquiry" onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><p className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{selected.message}</p></section></div>}
      {deleteTarget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b3d]/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-bold text-[#0b1d45]">Delete inquiry?</h2><p className="mt-2 text-sm text-slate-500">This will permanently remove this message.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="button" disabled={deleting} onClick={() => void deleteInquiry()} className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{deleting ? <><Loader2 size={15} className="mr-2 inline animate-spin" />Deleting...</> : "Delete"}</button></div></section></div>}
    </div>
  );
}
