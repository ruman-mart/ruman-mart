"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
      .filter((page) => page > 0 && page <= totalPages)
      .sort((a, b) => a - b);

  return (
    <nav
      aria-label="Pagination"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
      className="fixed bottom-3 left-1/2 z-40 flex w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center justify-center gap-1 overflow-x-auto rounded-full border border-slate-200/80 bg-white/90 px-2 py-2 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.02] backdrop-blur-md scrollbar-none sm:bottom-5 sm:w-auto sm:max-w-[calc(100vw-2rem)] sm:flex-wrap sm:gap-1.5 sm:overflow-visible sm:px-3 sm:py-2.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-[#0b1d45] active:scale-90 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent sm:h-9 sm:w-9"
      >
        <ChevronLeft size={16} className="sm:hidden" />
        <ChevronLeft size={17} className="hidden sm:block" />
      </button>

      {pages.map((page, index) => (
        <span key={page} className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {index > 0 && page - pages[index - 1] > 1 && (
            <span className="px-0.5 text-xs font-semibold text-slate-300 sm:text-sm">···</span>
          )}
          <button
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 active:scale-90 sm:h-9 sm:w-9 sm:text-sm ${
              page === currentPage
                ? "scale-105 bg-gradient-to-br from-[#22d3f5] to-[#0b9dcc] text-white shadow-[0_6px_16px_-4px_rgba(11,157,204,0.6)]"
                : "text-slate-600 hover:scale-105 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        </span>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-[#0b1d45] active:scale-90 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent sm:h-9 sm:w-9"
      >
        <ChevronRight size={16} className="sm:hidden" />
        <ChevronRight size={17} className="hidden sm:block" />
      </button>
    </nav>
  );
}