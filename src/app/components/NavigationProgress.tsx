"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPathname = useRef(pathname);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!visible || pathname === startPathname.current) return;

    const remainingTime = Math.max(0, 500 - (Date.now() - startedAt.current));
    const completionTimer = setTimeout(() => {
      setComplete(true);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setComplete(false);
      }, 280);
    }, remainingTime);

    return () => {
      clearTimeout(completionTimer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [pathname, visible]);

  useEffect(() => {
    function startProgress() {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      startPathname.current = pathname;
      startedAt.current = Date.now();
      setComplete(false);
      setVisible(true);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.search === window.location.search) return;
      startProgress();
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!visible) return null;

  return <div aria-hidden="true" className={`navigation-progress ${complete ? "navigation-progress-complete" : ""}`} />;
}