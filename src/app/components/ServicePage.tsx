import Link from "next/link";
import { ArrowRight, ChevronRight, Home as HomeIcon } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type ServiceSection = {
  heading: string;
  paragraphs: string[];
};

type ServicePageProps = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: ServiceSection[];
};

export default function ServicePage({ title, eyebrow, intro, sections }: ServicePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
      <Navbar />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-[#031a3b]">
          <div className="absolute inset-0 bg-[url('/mobile-hero.webp')] bg-cover bg-center sm:hidden" aria-hidden="true" />
          <div className="absolute inset-0 hidden bg-[url('/hero.webp')] bg-cover bg-center sm:block" aria-hidden="true" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#031a3b]/90 via-[#031a3b]/45 to-transparent sm:block sm:from-[#031a3b]/75 sm:via-[#031a3b]/35 sm:to-transparent" />
          <div className="relative mx-auto flex min-h-[340px] max-w-[1800px] items-center px-5 py-8 sm:min-h-[300px] md:min-h-[400px] md:px-8">
            <div className="max-w-2xl text-white">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-1 hover:text-white"><HomeIcon size={12} aria-hidden="true" /> Home</Link>
                <ChevronRight size={12} aria-hidden="true" />
                <span className="text-slate-100">{title}</span>
              </div>
              <div className="border-l-4 border-[#19d5f2] pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19d5f2]">{eyebrow}</p>
                <h1 className="mt-2 text-[2rem] font-bold leading-tight sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">{intro}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Ruman Mart Support</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0b1d45] sm:text-3xl">Everything you need to know</h2>
            </div>
            <Link href="/contact" className="hidden items-center gap-1 text-sm font-semibold text-[#0b75a5] hover:text-[#064d70] sm:inline-flex">Contact us <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section, index) => (
              <section key={section.heading} className="rounded-xl border border-slate-200 border-t-4 border-t-[#19c9ee] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f7fc] text-sm font-bold text-[#0b75a5]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0b1d45]">{section.heading}</h3>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-2 text-sm leading-6 text-slate-600">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#19c9ee] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0db4d8] sm:hidden">
            Contact us <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
