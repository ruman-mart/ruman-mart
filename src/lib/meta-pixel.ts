"use client";

export type MetaEventParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __rumanMetaPixelQueue?: Array<() => void>;
  }
}

export function trackMetaEvent(
  eventName: string,
  params: MetaEventParams,
  eventId?: string,
): void {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId || !/^\d+$/.test(pixelId)) return;

  const track = () => {
    window.fbq?.(
      "track",
      eventName,
      params,
      ...(eventId ? [{ eventID: eventId }] : []),
    );
  };

  if (window.fbq) {
    track();
  } else {
    window.__rumanMetaPixelQueue ??= [];
    window.__rumanMetaPixelQueue.push(track);
  }

}

export function flushMetaPixelQueue() {
  const pendingEvents = window.__rumanMetaPixelQueue ?? [];
  window.__rumanMetaPixelQueue = [];
  pendingEvents.forEach((track) => track());
}
