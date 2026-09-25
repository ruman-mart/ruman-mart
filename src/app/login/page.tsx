"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Unable to sign in.");
      router.push("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#f6f8fb] text-slate-800">
      <section className="relative hidden w-[46%] overflow-hidden bg-[#071b3d] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border-[42px] border-[#1fb6e6]/20" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border-[52px] border-[#f6c453]/10" />
        <Link href="/" className="relative text-2xl font-bold tracking-tight">Ruman<span className="text-[#1fb6e6]">Mart</span></Link>
        <div className="relative max-w-md">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#1fb6e6]">Admin access</p>
          <h1 className="text-4xl font-bold leading-tight">Welcome back, Admin.</h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Sign in to manage products, orders, customers, and everything happening across Ruman Mart.</p>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-300"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><ShoppingBag size={17} /></span> Your store is ready for today</div>
        </div>
        <p className="relative text-xs text-slate-500">© 2026 Ruman Mart. All rights reserved.</p>
      </section>

      <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[54%]">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 lg:hidden"><Link href="/" className="text-2xl font-bold tracking-tight text-[#071b3d]">Ruman<span className="text-[#0b9dcc]">Mart</span></Link></div>
          <div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Ruman Mart Admin</p><h2 className="text-3xl font-bold tracking-tight text-[#0b1d45]">Welcome back, Admin</h2><p className="mt-2 text-sm text-slate-500">Sign in to open your store dashboard and keep Ruman Mart moving.</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition-colors focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><Mail size={17} className="text-slate-400" /><input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /></div></div>
            <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label><Link href="#" className="text-xs font-semibold text-[#0b75a5] hover:text-[#0b1d45]">Forgot password?</Link></div><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition-colors focus-within:border-[#1fb6e6] focus-within:ring-2 focus-within:ring-[#1fb6e6]/20"><LockKeyhole size={17} className="text-slate-400" /><input id="password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
            <label className="flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#0b75a5]" /> Remember me</label>
            {message && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p>}
            <button type="submit" disabled={submitting} className="h-12 w-full rounded-xl bg-[#0b1d45] text-sm font-bold text-white shadow-lg shadow-[#0b1d45]/15 transition-colors hover:bg-[#102d62] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Signing in..." : "Sign in"}</button>
          </form>
         
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} /> Secure and private checkout</div>
        </div>
      </section>
    </main>
  );
}