"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save, Settings2, Upload, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

const regions = [
  ["punjab", "Punjab"],
  ["sindh", "Sindh"],
  ["khyber-pakhtunkhwa", "Khyber Pakhtunkhwa"],
  ["balochistan", "Balochistan"],
  ["islamabad", "Islamabad Capital Territory"],
  ["azad-kashmir", "Azad Jammu and Kashmir"],
  ["gilgit-baltistan", "Gilgit-Baltistan"],
] as const;

const defaultRates = { punjab: 250, sindh: 200, "khyber-pakhtunkhwa": 300, balochistan: 350, islamabad: 250, "azad-kashmir": 350, "gilgit-baltistan": 450 };

export default function AdminSettingsPage() {
  const [rates, setRates] = useState<Record<string, number>>(defaultRates);
  const [advanceShipping, setAdvanceShipping] = useState(false);
  const [advanceAccountNumber, setAdvanceAccountNumber] = useState("");
  const [advanceAccountTitle, setAdvanceAccountTitle] = useState("");
  const [advanceAccountName, setAdvanceAccountName] = useState("");
  const [logoUrl, setLogoUrl] = useState("/logo-web.png");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    void fetch("/api/settings/shipping")
      .then(async (response) => response.ok ? await response.json() as { rates: Record<string, number>; advanceShipping: boolean; advanceAccountNumber: string; advanceAccountTitle: string; advanceAccountName: string; logoUrl: string; storeAddress: string; storePhone: string; storeEmail: string; facebookUrl: string; instagramUrl: string; tiktokUrl: string; whatsappUrl: string } : null)
      .then((settings) => {
        if (!settings) return;
        setRates({ ...defaultRates, ...settings.rates });
        setAdvanceShipping(settings.advanceShipping);
        setAdvanceAccountNumber(settings.advanceAccountNumber);
        setAdvanceAccountTitle(settings.advanceAccountTitle);
        setAdvanceAccountName(settings.advanceAccountName);
        setLogoUrl(settings.logoUrl); setStoreAddress(settings.storeAddress); setStorePhone(settings.storePhone); setStoreEmail(settings.storeEmail); setFacebookUrl(settings.facebookUrl); setInstagramUrl(settings.instagramUrl); setTiktokUrl(settings.tiktokUrl); setWhatsappUrl(settings.whatsappUrl);
      })
      .catch(() => undefined);
  }, []);

  async function saveSettings() {
    setMessage("");
    const response = await fetch("/api/settings/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates, advanceShipping, advanceAccountNumber, advanceAccountTitle, advanceAccountName, logoUrl, storeAddress, storePhone, storeEmail, facebookUrl, instagramUrl, tiktokUrl, whatsappUrl }),
    });
    const result = await response.json().catch(() => ({})) as { message?: string };
    if (response.ok) {
      setMessage("");
      setShowSuccess(true);
    } else {
      setMessage(result.message ?? "Unable to save settings.");
    }
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const result = await response.json().catch(() => ({})) as { url?: string; message?: string };
    if (response.ok && result.url) {
      setLogoUrl(result.url);
      setMessage("");
    } else {
      setMessage(result.message ?? "Unable to upload logo.");
    }
    setUploadingLogo(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[248px]">
        <AdminSidebar activeNav="Settings" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={() => undefined} />
        <AdminHeader query="" onQueryChange={() => undefined} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]"><ArrowLeft size={15} /> Dashboard</Link>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Store configuration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage checkout shipping charges and payment options.</p>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7fc] text-[#0b75a5]"><Settings2 size={19} /></span><div><h2 className="font-bold text-[#0b1d45]">Shipping charges</h2><p className="mt-1 text-xs text-slate-500">Rates are applied to checkout by selected province.</p></div></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {regions.map(([id, label]) => <label key={id} className="text-sm font-semibold text-slate-700">{label}<div className="mt-2 flex items-center rounded-lg border border-slate-200"><span className="px-3 text-sm text-slate-400">Rs.</span><input type="number" min="0" value={rates[id]} onChange={(event) => setRates((current) => ({ ...current, [id]: Number(event.target.value) }))} className="h-11 w-full border-l border-slate-200 px-3 text-sm outline-none focus:border-[#1fb6e6]" /></div></label>)}
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-[#0b1d45]">Payment options</h2>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"><input type="checkbox" checked={advanceShipping} onChange={(event) => setAdvanceShipping(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0b75a5]" /><span><span className="block text-sm font-semibold text-slate-700">Enable shipping advance</span><span className="mt-1 block text-xs text-slate-500">Show advance shipping payment as an option during checkout.</span></span></label>
            {advanceShipping && <div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold text-slate-700">Account name<input value={advanceAccountName} onChange={(event) => setAdvanceAccountName(event.target.value)} placeholder="Owner account holder name" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label><label className="text-sm font-semibold text-slate-700">Account title<input value={advanceAccountTitle} onChange={(event) => setAdvanceAccountTitle(event.target.value)} placeholder="e.g. Easypaisa / Bank account" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label><label className="text-sm font-semibold text-slate-700">Account number<input value={advanceAccountNumber} onChange={(event) => setAdvanceAccountNumber(event.target.value)} placeholder="Enter account number" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label></div>}
          </section>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-[#0b1d45]">Website profile</h2>
            <p className="mt-1 text-xs text-slate-500">Update the logo, store contact details and social links shown publicly.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Logo URL<input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="/logo-web.png or image URL" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /><span className="mt-2 flex items-center gap-3"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLogo(file); }} className="block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-500" /><span className="shrink-0 text-xs text-slate-400">{uploadingLogo ? "Uploading..." : "Max 5MB"}</span></span>{logoUrl && <img src={logoUrl} alt="Logo preview" className="mt-3 h-14 w-32 rounded-lg border border-slate-200 bg-slate-50 object-contain p-2" />}</label>
              <label className="text-sm font-semibold text-slate-700">Store address<input value={storeAddress} onChange={(event) => setStoreAddress(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Phone<input value={storePhone} onChange={(event) => setStorePhone(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Email<input type="email" value={storeEmail} onChange={(event) => setStoreEmail(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Facebook URL<input value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Instagram URL<input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">TikTok URL<input value={tiktokUrl} onChange={(event) => setTiktokUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">WhatsApp URL<input value={whatsappUrl} onChange={(event) => setWhatsappUrl(event.target.value)} placeholder="https://wa.me/923..." className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
            </div>
          </section>

          <div className="mt-5 flex items-center justify-end gap-3"><p className="mr-auto text-sm text-rose-600">{message}</p><button type="button" onClick={() => void saveSettings()} className="inline-flex items-center gap-2 rounded-lg bg-[#0b1d45] px-5 py-3 text-sm font-bold text-white hover:bg-[#102d62]"><Save size={16} /> Save settings</button></div>
        </main>
      </div>
      {showSuccess && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b3d]/45 p-4"><div role="dialog" aria-modal="true" className="relative w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"><button type="button" aria-label="Close success message" onClick={() => setShowSuccess(false)} className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button><CheckCircle2 size={48} className="mx-auto text-emerald-500" /><h2 className="mt-4 text-xl font-bold text-[#0b1d45]">Settings saved</h2><p className="mt-2 text-sm text-slate-500">Shipping and advance payment settings have been updated.</p><button type="button" onClick={() => setShowSuccess(false)} className="mt-5 rounded-lg bg-[#0b1d45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102d62]">Done</button></div></div>}
    </div>
  );
}
