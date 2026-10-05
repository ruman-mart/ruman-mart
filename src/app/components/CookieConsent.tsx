"use client";

import { Cookie, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const CONSENT_COOKIE = "ruman_cookie_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
const CONSENT_EVENT = "ruman-cookie-consent-updated";

type ConsentChoice = "all" | "necessary";

function subscribeToConsent(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

function hasConsentChoice() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`));
}

export default function CookieConsent() {
  const hasConsent = useSyncExternalStore(
    subscribeToConsent,
    hasConsentChoice,
    () => false,
  );

  const saveChoice = (choice: ConsentChoice) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (hasConsent) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-[#031a3b]/20 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f7fc] text-[#0b75a5]">
            <Cookie size={21} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#0b1d45]">Your cookie choices</h2>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              We use necessary cookies to keep the store working and remember your choice.
              You can allow all cookies or keep only the necessary ones.{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-[#0b75a5] underline underline-offset-2 hover:text-[#064d70]"
              >
                Privacy policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => saveChoice("necessary")}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19c9ee]"
          >
            <ShieldCheck size={16} aria-hidden="true" />
            Necessary Only
          </button>
          <button
            type="button"
            onClick={() => saveChoice("all")}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0b1d45] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b75a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19c9ee]"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
