"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, ShoppingBag, UserRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Unable to create account.");
      router.push("/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#f6f8fb] text-slate-800">
      <section className="relative hidden w-[42%] overflow-hidden bg-[#071b3d] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-24 h-80 w-80 rounded-full border-[42px] border-[#1fb6e6]/20" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border-[52px] border-[#f6c453]/10" />
        <Link href="/" className="relative text-2xl font-bold tracking-tight">Ruman<span className="text-[#1fb6e6]">Mart</span></Link>
        <div className="relative max-w-md"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1fb6e6]">Admin setup</p><h1 className="text-4xl font-bold leading-tight">Create your Ruman Mart admin account.</h1><p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Set up the account you will use to manage products, orders, customers, and your store dashboard.</p><div className="mt-8 flex items-center gap-3 text-sm text-slate-300"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><ShoppingBag size={17} /></span> One admin account for your store</div></div>
        <p className="relative text-xs text-slate-500">© 2026 Ruman Mart. All rights reserved.</p>
      </section>

      <section className="flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[58%]">
        <div className="w-full max-w-[500px]">
          <div className="mb-7 lg:hidden"><Link href="/" className="text-2xl font-bold tracking-tight text-[#071b3d]">Ruman<span className="text-[#0b9dcc]">Mart</span></Link></div>
          <div className="mb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Admin registration</p><h2 className="text-3xl font-bold tracking-tight text-[#0b1d45]">Create admin account</h2><p className="mt-2 text-sm text-slate-500">Use this account to sign in to the Ruman Mart admin panel.</p></div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><UserRound size={17} className="text-slate-400" /><input id="full-name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} type="text" placeholder="Your full name" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /></div></div>
            <div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><Phone size={17} className="text-slate-400" /><input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} type="tel" placeholder="03XX XXXXXXX" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /></div></div>
            <div className="sm:col-span-2"><label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><Mail size={17} className="text-slate-400" /><input id="register-email" value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" placeholder="you@example.com" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /></div></div>
            <div className="sm:col-span-2"><label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><LockKeyhole size={17} className="text-slate-400" /><input id="register-password" value={form.password} onChange={(event) => updateField("password", event.target.value)} type={showPassword ? "text" : "password"} placeholder="At least 8 characters" minLength={8} className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
            <label className="flex items-start gap-2 text-xs leading-5 text-slate-500 sm:col-span-2"><input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#0b75a5]" required /> I agree to the <Link href="/terms" className="font-semibold text-[#0b75a5]">Terms & Conditions</Link> and Privacy Policy.</label>
            {message && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">{message}</p>}
            <button type="submit" disabled={submitting} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1d45] text-sm font-bold text-white shadow-lg shadow-[#0b1d45]/15 transition-colors hover:bg-[#102d62] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2">{submitting ? "Creating account..." : "Create account"} {!submitting && <ArrowRight size={16} />}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-[#0b75a5] hover:text-[#0b1d45]">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}