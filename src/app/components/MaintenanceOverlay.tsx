"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";

export default function MaintenanceOverlay() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLElement>(null);
  const isAdminPage =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ruman-admin-hub") ||
    pathname.startsWith("/rm-secure-console") ||
    pathname.startsWith("/ruman-login");

  useEffect(() => {
    if (isAdminPage) return;

    const previousOverflow = document.body.style.overflow;
    const keepFocusInDialog = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        dialogRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    window.addEventListener("keydown", keepFocusInDialog);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keepFocusInDialog);
    };
  }, [isAdminPage]);

  if (isAdminPage) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#071b3d]/85 p-4 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        aria-describedby="maintenance-message"
        tabIndex={-1}
        ref={dialogRef}
        className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-7 text-center shadow-2xl sm:p-10"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-[#b45309]">
          <Wrench size={30} aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Ruman Mart</p>
        <h1 id="maintenance-title" className="mt-2 text-2xl font-bold text-[#0b1d45] sm:text-3xl">
          We&apos;ll be back soon
        </h1>
        <p id="maintenance-message" className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Our website is temporarily under maintenance. We apologize for the inconvenience and appreciate your patience.
        </p>
      </section>
    </div>
  );
}
