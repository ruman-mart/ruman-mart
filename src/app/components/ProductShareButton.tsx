"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductShareModal from "./ProductShareModal";

/** Curved, outlined share arrow (same style as the reference image). */
function ShareArrowIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 20.5C3.5 13.5 7.5 8 14 8V3.5L21.5 10.5L14 17.5V13C9.8 13 6.2 15 3.5 20.5Z" />
    </svg>
  );
}

type ProductShareButtonProps = {
  productName: string;
  productUrl?: string;
  className?: string;
};

export default function ProductShareButton({
  productName,
  productUrl,
  className = "",
}: ProductShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
      wasOpen.current = false;
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Share ${productName}`}
        title={`Share ${productName}`}
        className={[
          "group pointer-events-auto inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg",
          "transition-all duration-300 ease-out motion-safe:active:scale-90",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#bfeaf6]",
          "bg-white text-[#0b75a5] shadow-sm ring-1 ring-[#bfeaf6] hover:bg-[#e6f7fc] hover:shadow-md motion-safe:hover:-translate-y-0.5",
          className,
        ].join(" ")}
      >
        <ShareArrowIcon
          size={20}
          className="transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:translate-x-0.5"
        />
      </button>
      {isOpen && (
        <ProductShareModal
          productName={productName}
          productUrl={productUrl}
          onClose={closeModal}
        />
      )}
    </>
  );
}