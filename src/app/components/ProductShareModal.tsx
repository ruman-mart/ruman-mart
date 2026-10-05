"use client";

import {
  Check,
  Copy,
  Ellipsis,
  Mail,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ProductShareModalProps = {
  productName: string;
  productUrl?: string;
  onClose: () => void;
};

/** Curved outlined share arrow, used as the brand mark of this dialog. */
function ShareArrowIcon({
  size = 20,
  strokeWidth = 2,
  className = "",
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 20.5C3.5 13.5 7.5 8 14 8V3.5L21.5 10.5L14 17.5V13C9.8 13 6.2 15 3.5 20.5Z" />
    </svg>
  );
}

/** Official WhatsApp logo (speech bubble + phone handset). */
function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Facebook "f" mark. Newer lucide-react versions no longer ship brand icons. */
function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
    </svg>
  );
}

/** X (Twitter) mark, inline because lucide no longer ships brand icons. */
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** TikTok mark, inline because lucide no longer ships brand icons. */
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function ProductShareModal({
  productName,
  productUrl,
  onClose,
}: ProductShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [pasteHint, setPasteHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const shareUrl = new URL(
    productUrl ?? window.location.href,
    window.location.origin,
  ).toString();
  const shareText = `Check out ${productName} on Ruman Mart`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (!pasteHint) return undefined;
    const timeout = window.setTimeout(() => setPasteHint(false), 6000);
    return () => window.clearTimeout(timeout);
  }, [pasteHint]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setCopyError(false);
      return;
    } catch {
      inputRef.current?.select();
    }

    try {
      if (document.execCommand("copy")) {
        setCopied(true);
        setCopyError(false);
        return;
      }
    } catch {
      setCopyError(true);
    }
    setCopyError(true);
  };

  // Mobile: bigger touch targets (min ~84px tall), tap feedback, and hover
  // lift only on devices that really hover (avoids "sticky hover" on touch).
  const tileBase =
    "group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-0.5 py-2.5 text-center text-[10px] min-[360px]:rounded-2xl min-[360px]:text-[11px] font-semibold leading-tight text-[#0b1d45] transition-all duration-200 active:scale-95 active:bg-slate-50 sm:gap-2.5 sm:px-1 sm:py-3.5 sm:text-xs [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-[#19c9ee]/60 [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-[#0b1d45]/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19c9ee]/40";
  const badgeBase =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md sm:h-11 sm:w-11 transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-110";

  const encodedSubject = encodeURIComponent(productName);
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const nativeShare = async () => {
    try {
      await navigator.share({ title: productName, text: shareText, url: shareUrl });
    } catch {
      // Dismissed by the user or unsupported; nothing to do.
    }
  };

  // TikTok has no public web share link, so open TikTok and copy the link
  // so it can be pasted into a message, comment or bio.
  const shareToTikTok = () => {
    window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer");
    void copyLink();
    setPasteHint(true);
  };

  type ShareOption = {
    label: string;
    badge: string; // background + glow colour classes
    icon: ReactNode;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  };

  const options: ShareOption[] = [
    {
      label: "WhatsApp",
      badge: "bg-[#25d366] shadow-[#25d366]/40",
      icon: <WhatsAppIcon size={23} />,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      external: true,
    },
    {
      label: "Facebook",
      badge: "bg-[#1877f2] shadow-[#1877f2]/40",
      icon: <FacebookIcon size={21} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      external: true,
    },
    {
      label: "TikTok",
      badge: "bg-[#010101] shadow-[#fe2c55]/40",
      icon: <TikTokIcon size={19} />,
      onClick: shareToTikTok,
    },
    {
      label: "Telegram",
      badge: "bg-[#229ed9] shadow-[#229ed9]/40",
      icon: <Send size={20} aria-hidden="true" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      external: true,
    },
    {
      label: "X",
      badge: "bg-black shadow-black/30",
      icon: <XIcon size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      external: true,
    },
    {
      label: "SMS",
      badge: "bg-[#19c9ee] text-[#0b1d45] shadow-[#19c9ee]/40",
      icon: <MessageSquare size={21} aria-hidden="true" />,
      href: `sms:?&body=${encodedText}%20${encodedUrl}`,
    },
    {
      label: "Email",
      badge: "bg-[#0b1d45] shadow-[#0b1d45]/40",
      icon: <Mail size={21} aria-hidden="true" />,
      // Phones open their mail app via mailto. On desktop many people have no
      // mail app set up (mailto then does nothing), so open Gmail compose instead.
      href: isMobile
        ? `mailto:?subject=${encodedSubject}&body=${encodedText}%0A${encodedUrl}`
        : `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedText}%0A${encodedUrl}`,
      external: !isMobile,
    },
  ];

  if (canNativeShare) {
    options.push({
      label: "More",
      badge: "bg-gradient-to-br from-[#12357a] to-[#0b75a5] shadow-[#0b75a5]/40",
      icon: <Ellipsis size={22} aria-hidden="true" />,
      onClick: () => void nativeShare(),
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#050f26]/70 backdrop-blur-sm sm:items-center sm:p-4"
      // React events from a portal still bubble through the React tree, so a
      // parent card/link/share button could react to clicks made inside the
      // modal (e.g. reopen it or navigate). Stop them here.
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {/* One entrance moment; skipped for people who prefer reduced motion. */}
      <style>{`
        @keyframes rm-share-in {
          from { opacity: 0; transform: translateY(24px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .rm-share-in { animation: rm-share-in .28s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .rm-share-in { animation: none; } }
      `}</style>

      {/*
        Mobile  = bottom sheet: full width, rounded top, capped at 92% of the
                  *dynamic* viewport height (so browser URL bars don't cut it)
                  and the body scrolls if the screen is short (landscape, small phones).
        Desktop = centered card.
      */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="rm-share-in flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-[#031a3b]/40 sm:max-h-[90dvh] sm:rounded-3xl"
      >
        {/* Brand header (never scrolls away) */}
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#0b1d45] via-[#12357a] to-[#0b75a5] px-4 pb-5 pt-3 text-white sm:px-6 sm:pb-7 sm:pt-6">
          {/* decorative glow + oversized arrow watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#19c9ee]/30 blur-3xl"
          />
          <ShareArrowIcon
            size={150}
            strokeWidth={1.2}
            className="pointer-events-none absolute -bottom-6 -right-4 text-white/10"
          />

          {/* Mobile-only grab handle (visual cue that this is a bottom sheet) */}
          <span
            aria-hidden="true"
            className="relative mx-auto mb-3 block h-1 w-10 rounded-full bg-white/30 sm:hidden"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }}
            aria-label="Close share dialog"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19c9ee] sm:right-4 sm:top-4 sm:h-9 sm:w-9"
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div className="relative flex items-center gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#19c9ee] text-[#0b1d45] shadow-lg shadow-[#19c9ee]/40 sm:h-14 sm:w-14">
              <ShareArrowIcon size={26} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 pr-12">
              <h2
                id={titleId}
                className="text-lg font-bold leading-tight sm:text-xl"
              >
                Share this product
              </h2>
              <p className="mt-0.5 text-[13px] text-sky-100/80 sm:mt-1 sm:text-sm">
                Send it to family and friends
              </p>
            </div>
          </div>

          <p className="relative mt-4 truncate rounded-xl bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur-sm sm:mt-5">
            {productName}
          </p>
        </header>

        {/* Scrollable body + safe-area padding for iPhone home indicator */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 min-[360px]:px-4 sm:p-6">
          <p className="mb-2 text-sm font-semibold text-[#0b1d45]">Product link</p>

          {/* Stacks on very narrow phones (<380px), side-by-side otherwise */}
          <div className="flex min-w-0 flex-col gap-2 rounded-2xl border-2 border-[#bfeaf6] bg-[#f3fbfe] p-1.5 transition-colors focus-within:border-[#19c9ee] min-[380px]:flex-row min-[380px]:items-center">
            <input
              ref={inputRef}
              aria-label="Product link"
              readOnly
              value={shareUrl}
              onFocus={(event) => event.currentTarget.select()}
              // text-base (16px) on mobile stops iOS Safari from zooming the page on focus
              className="h-10 min-w-0 flex-1 truncate bg-transparent px-3 text-base text-slate-600 outline-none sm:text-sm"
            />
            <button
              type="button"
              onClick={() => void copyLink()}
              className={[
                "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19c9ee]/40 motion-safe:active:scale-95",
                copied
                  ? "bg-[#19c9ee] text-[#0b1d45] shadow-[#19c9ee]/40"
                  : "bg-gradient-to-br from-[#0b1d45] to-[#12357a] text-white shadow-[#0b1d45]/30 hover:from-[#12357a] hover:to-[#0b75a5]",
              ].join(" ")}
            >
              {copied ? (
                <Check size={16} strokeWidth={3} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              <span>{copied ? "Copied" : "Copy link"}</span>
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </p>
          {copyError && (
            <p role="status" className="mt-2 text-xs text-rose-600">
              Copy wasn’t available. Select the link above and copy it.
            </p>
          )}

          <p className="mb-3 mt-5 text-sm font-semibold text-[#0b1d45] sm:mt-6">
            Share via
          </p>
          {/* Always 4 per row; tiles shrink a little on small phones */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
            {options.map((option) => {
              const content = (
                <>
                  <span className={`${badgeBase} ${option.badge}`}>{option.icon}</span>
                  <span className="max-w-full truncate">{option.label}</span>
                </>
              );
              return option.href ? (
                <a
                  key={option.label}
                  href={option.href}
                  {...(option.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={tileBase}
                >
                  {content}
                </a>
              ) : (
                <button
                  key={option.label}
                  type="button"
                  onClick={option.onClick}
                  className={tileBase}
                >
                  {content}
                </button>
              );
            })}
          </div>

          {pasteHint && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-[#e6f7fc] px-3.5 py-2.5 text-center text-xs font-semibold text-[#0b1d45]"
            >
              Link copied. Open TikTok and paste it in a message or your bio.
            </p>
          )}

          <p className="mt-5 text-center text-xs font-medium text-slate-400 sm:mt-6">
            Ruman Mart · Shop Smart, Live Better
          </p>
        </div>
      </section>
    </div>,
    document.body,
  );
}