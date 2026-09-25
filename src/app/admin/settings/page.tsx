"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Save, Settings2, Upload, UserRound, X } from "lucide-react";
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
  const [adminName, setAdminName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>(defaultRates);
  const [advanceShipping, setAdvanceShipping] = useState(false);
  const [advanceAccountNumber, setAdvanceAccountNumber] = useState("");
  const [advanceAccountTitle, setAdvanceAccountTitle] = useState("");
  const [advanceAccountName, setAdvanceAccountName] = useState("");
  const [logoUrl, setLogoUrl] = useState("/logo-web.webp");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [aboutStoryTitle, setAboutStoryTitle] = useState("Built with Passion, For Your Convenience");
  const [aboutStoryText, setAboutStoryText] = useState("");
  const [aboutStorySecondText, setAboutStorySecondText] = useState("");
  const [aboutStoryImage, setAboutStoryImage] = useState("/about.webp");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/profile", { cache: "no-store" })
        .then(async (response) => response.ok ? await response.json() as { fullName: string; avatarUrl?: string } : null)
      .then((profile) => { if (profile) { setAdminName(profile.fullName); setAvatarUrl(profile.avatarUrl ?? ""); } })
      .catch(() => undefined);

    void fetch("/api/settings/shipping")
      .then(async (response) => response.ok ? await response.json() as { rates: Record<string, number>; advanceShipping: boolean; advanceAccountNumber: string; advanceAccountTitle: string; advanceAccountName: string; logoUrl: string; storeAddress: string; storePhone: string; storeEmail: string; facebookUrl: string; instagramUrl: string; tiktokUrl: string; whatsappUrl: string; aboutStoryTitle: string; aboutStoryText: string; aboutStorySecondText: string; aboutStoryImage: string } : null)
      .then((settings) => {
        if (!settings) return;
        setRates({ ...defaultRates, ...settings.rates });
        setAdvanceShipping(settings.advanceShipping);
        setAdvanceAccountNumber(settings.advanceAccountNumber);
        setAdvanceAccountTitle(settings.advanceAccountTitle);
        setAdvanceAccountName(settings.advanceAccountName);
        setLogoUrl(settings.logoUrl); setStoreAddress(settings.storeAddress); setStorePhone(settings.storePhone); setStoreEmail(settings.storeEmail); setFacebookUrl(settings.facebookUrl); setInstagramUrl(settings.instagramUrl); setTiktokUrl(settings.tiktokUrl); setWhatsappUrl(settings.whatsappUrl);
        setAboutStoryTitle(settings.aboutStoryTitle); setAboutStoryText(settings.aboutStoryText); setAboutStorySecondText(settings.aboutStorySecondText); setAboutStoryImage(settings.aboutStoryImage);
      })
      .catch(() => undefined);
  }, []);

  async function saveAccount() {
    if (accountSaving) return;
    setAccountSaving(true);
    setAccountMessage("");
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: adminName, avatarUrl, currentPassword, newPassword }),
    });
    const result = await response.json().catch(() => ({})) as { message?: string; fullName?: string };
    if (response.ok) {
      setAdminName(result.fullName ?? adminName.trim());
      setCurrentPassword("");
      setNewPassword("");
      setAccountMessage("Admin account updated successfully.");
    } else {
      setAccountMessage(result.message ?? "Unable to update admin account.");
    }
    setAccountSaving(false);
  }

  async function saveSettings() {
    if (saving) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/settings/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates, advanceShipping, advanceAccountNumber, advanceAccountTitle, advanceAccountName, logoUrl, storeAddress, storePhone, storeEmail, facebookUrl, instagramUrl, tiktokUrl, whatsappUrl, aboutStoryTitle, aboutStoryText, aboutStorySecondText, aboutStoryImage }),
    });
    const result = await response.json().catch(() => ({})) as { message?: string };
    if (response.ok) {
      setMessage("");
      setShowSuccess(true);
    } else {
      setMessage(result.message ?? "Unable to save settings.");
    }
    setSaving(false);
  }

  async function uploadLogo(file: File) {
    if (uploadingLogo) return;
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

  async function uploadAvatar(file: File) {
    if (uploadingAvatar) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const result = await response.json().catch(() => ({})) as { url?: string; message?: string };
    if (response.ok && result.url) {
      setAvatarUrl(result.url);
      setAccountMessage("Profile picture uploaded. Click Save account to apply it.");
    } else {
      setAccountMessage(result.message ?? "Unable to upload profile picture.");
    }
    setUploadingAvatar(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[260px]">
        <AdminSidebar activeNav="Settings" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelect={() => undefined} />
        <AdminHeader query="" onQueryChange={() => undefined} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <Link href="/ruman-admin-hub" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]"><ArrowLeft size={15} /> Dashboard</Link>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">Store configuration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage checkout shipping charges and payment options.</p>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7fc] text-[#0b75a5]"><UserRound size={19} /></span><div><h2 className="font-bold text-[#0b1d45]">Admin account</h2><p className="mt-1 text-xs text-slate-500">Update your name or change your password.</p></div></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold text-slate-700">Profile picture<span className="mt-2 flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6f7fc] text-sm font-bold text-[#0b75a5]">{avatarUrl ? <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" /> : "RM"}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadAvatar(file); }} className="block min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-500" /></span><span className="mt-1 block text-xs font-normal text-slate-400">{uploadingAvatar ? "Uploading..." : "JPG, PNG, WebP or GIF. Max 5MB."}</span></label>
              <label className="text-sm font-semibold text-slate-700">Admin name<input value={adminName} onChange={(event) => setAdminName(event.target.value)} placeholder="Enter admin name" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Required for password change" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">New password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Leave blank to keep it" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3"><p className={`mr-auto text-sm ${accountMessage.includes("successfully") ? "text-emerald-600" : "text-rose-600"}`}>{accountMessage}</p><button type="button" disabled={accountSaving} onClick={() => void saveAccount()} className="inline-flex items-center gap-2 rounded-lg bg-[#0b1d45] px-5 py-3 text-sm font-bold text-white hover:bg-[#102d62] disabled:cursor-wait disabled:opacity-60">{accountSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {accountSaving ? "Saving..." : "Save account"}</button></div>
          </section>

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
              <label className="text-sm font-semibold text-slate-700">Logo URL<input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="/logo-web.webp or image URL" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /><span className="mt-2 flex items-center gap-3"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLogo(file); }} className="block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-500" /><span className="shrink-0 text-xs text-slate-400">{uploadingLogo ? "Uploading..." : "Max 5MB"}</span></span>{logoUrl && <img src={logoUrl} alt="Logo preview" className="mt-3 h-14 w-32 rounded-lg border border-slate-200 bg-slate-50 object-contain p-2" />}</label>
              <label className="text-sm font-semibold text-slate-700">Store address<input value={storeAddress} onChange={(event) => setStoreAddress(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Phone<input value={storePhone} onChange={(event) => setStorePhone(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Email<input type="email" value={storeEmail} onChange={(event) => setStoreEmail(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Facebook URL<input value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Instagram URL<input value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">TikTok URL<input value={tiktokUrl} onChange={(event) => setTiktokUrl(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">WhatsApp URL<input value={whatsappUrl} onChange={(event) => setWhatsappUrl(event.target.value)} placeholder="https://wa.me/923..." className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-[#0b1d45]">About page story</h2>
            <p className="mt-1 text-xs text-slate-500">Update the Our Story section shown on the public About page.</p>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold text-slate-700">Story heading<input value={aboutStoryTitle} onChange={(event) => setAboutStoryTitle(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">First paragraph<textarea value={aboutStoryText} onChange={(event) => setAboutStoryText(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Second paragraph<textarea value={aboutStorySecondText} onChange={(event) => setAboutStorySecondText(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
              <label className="text-sm font-semibold text-slate-700">Story image URL<input value={aboutStoryImage} onChange={(event) => setAboutStoryImage(event.target.value)} placeholder="/about.webp or image URL" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]" /></label>
            </div>
          </section>

          <div className="mt-5 flex items-center justify-end gap-3"><p className="mr-auto text-sm text-rose-600">{message}</p><button type="button" disabled={saving} onClick={() => void saveSettings()} className="inline-flex items-center gap-2 rounded-lg bg-[#0b1d45] px-5 py-3 text-sm font-bold text-white hover:bg-[#102d62] disabled:cursor-wait disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? "Saving..." : "Save settings"}</button></div>
        </main>
      </div>
      {showSuccess && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b3d]/45 p-4"><div role="dialog" aria-modal="true" className="relative max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-7"><button type="button" aria-label="Close success message" onClick={() => setShowSuccess(false)} className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button><CheckCircle2 size={48} className="mx-auto text-emerald-500" /><h2 className="mt-4 text-xl font-bold text-[#0b1d45]">Settings saved</h2><p className="mt-2 text-sm text-slate-500">Shipping and advance payment settings have been updated.</p><button type="button" onClick={() => setShowSuccess(false)} className="mt-5 rounded-lg bg-[#0b1d45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102d62]">Done</button></div></div>}
    </div>
  );
}
