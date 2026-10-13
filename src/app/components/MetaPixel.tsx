"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { flushMetaPixelQueue, trackMetaEvent } from "@/lib/meta-pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const lastPageView = useRef<string | null>(null);
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const isValidPixelId = Boolean(pixelId && /^\d+$/.test(pixelId));

  useEffect(() => {
    if (!isValidPixelId) return;
    if (lastPageView.current === pathname) return;
    lastPageView.current = pathname;
    trackMetaEvent("PageView", {});
  }, [isValidPixelId, pathname]);

  if (!isValidPixelId || !pixelId) return null;

  return (
    <Script id="meta-pixel-base" strategy="afterInteractive" onReady={flushMetaPixelQueue}>
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');window.fbq('init',${JSON.stringify(pixelId)});`}
    </Script>
  );
}
