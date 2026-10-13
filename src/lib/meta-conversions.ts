import { createHash } from "node:crypto";

type PurchaseItem = {
  id: string;
  productSlug?: string;
  name: string;
  price: number;
  quantity: number;
};

type PurchaseEvent = {
  request: Request;
  eventId: string;
  value: number;
  items: PurchaseItem[];
  email: string;
  phone: string;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export async function sendMetaPurchase({
  request,
  eventId,
  value,
  items,
  email,
  phone,
}: PurchaseEvent) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !/^\d+$/.test(pixelId) || !accessToken) return;

  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v23.0";
  if (!/^v\d+\.\d+$/.test(apiVersion)) {
    throw new Error("META_GRAPH_API_VERSION must use the format vNN.N.");
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieValue = (name: string) =>
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  const phoneHash = normalizePhone(phone);
  const userData: Record<string, unknown> = {
    ...(email.trim() ? { em: [sha256(email.trim().toLowerCase())] } : {}),
    ...(phoneHash ? { ph: [sha256(phoneHash)] } : {}),
    ...(cookieValue("_fbp") ? { fbp: cookieValue("_fbp") } : {}),
    ...(cookieValue("_fbc") ? { fbc: cookieValue("_fbc") } : {}),
    ...(request.headers.get("user-agent")
      ? { client_user_agent: request.headers.get("user-agent") }
      : {}),
    ...(request.headers.get("x-real-ip")
      ? { client_ip_address: request.headers.get("x-real-ip") }
      : {}),
  };
  const contents = items.map((item) => ({
    id: item.productSlug || item.id,
    quantity: item.quantity,
    item_price: item.price,
  }));
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const eventSourceUrl = new URL(
    `/order-success?order=${encodeURIComponent(eventId)}`,
    request.url,
  ).toString();
  const endpoint = new URL(
    `https://graph.facebook.com/${apiVersion}/${pixelId}/events`,
  );
  endpoint.searchParams.set("access_token", accessToken);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: eventSourceUrl,
          user_data: userData,
          custom_data: {
            currency: "PKR",
            value,
            content_type: "product",
            content_ids: contents.map((item) => item.id),
            contents,
            num_items: totalItems,
          },
        },
      ],
      ...(process.env.META_TEST_EVENT_CODE
        ? { test_event_code: process.env.META_TEST_EVENT_CODE }
        : {}),
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Meta Conversions API returned HTTP ${response.status}.`);
  }
}
