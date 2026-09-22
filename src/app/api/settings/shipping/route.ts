import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import ShippingSettings from "@/lib/models/ShippingSettings";
import { runMigrations } from "@/lib/migrations";

const defaultRates = { punjab: 250, sindh: 200, "khyber-pakhtunkhwa": 300, balochistan: 350, islamabad: 250, "azad-kashmir": 350, "gilgit-baltistan": 450 };

function normalizeWhatsappUrl(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("92") ? digits.slice(0, 12) : digits.slice(0, 11);
  return normalized ? `https://wa.me/${normalized}` : "";
}

function isAuthorized() {
  return cookies().then((store) => Boolean(store.get("ruman_session")?.value));
}

export async function GET() {
  await runMigrations();
  let settings = await ShippingSettings.findByPk(1, { raw: true }) as unknown as Record<string, string | boolean> | null;
  if (!settings) {
    settings = { rates: JSON.stringify(defaultRates), advanceShipping: false };
  }
  let rates = defaultRates;
  try { rates = { ...defaultRates, ...JSON.parse(settings.rates ?? "{}") }; } catch { /* use defaults */ }
  return NextResponse.json({ rates, advanceShipping: Boolean(settings.advanceShipping), advanceAccountNumber: settings.advanceAccountNumber ?? "", advanceAccountTitle: settings.advanceAccountTitle ?? "", advanceAccountName: settings.advanceAccountName ?? "", logoUrl: settings.logoUrl ?? "/logo-web.png", storeAddress: settings.storeAddress ?? "RC7C+294 Shakeel General Store, Misri St, Hala, Pakistan", storePhone: settings.storePhone ?? "+92 304 1298136", storeEmail: settings.storeEmail ?? "rumanshakee56@gmail.com", facebookUrl: settings.facebookUrl ?? "", instagramUrl: settings.instagramUrl ?? "", tiktokUrl: settings.tiktokUrl ?? "", whatsappUrl: normalizeWhatsappUrl(String(settings.whatsappUrl ?? "")) });
}

export async function PUT(request: Request) {
  if (!(await isAuthorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as { rates?: Record<string, number>; advanceShipping?: boolean; advanceAccountNumber?: string; advanceAccountTitle?: string; advanceAccountName?: string; logoUrl?: string; storeAddress?: string; storePhone?: string; storeEmail?: string; facebookUrl?: string; instagramUrl?: string; tiktokUrl?: string; whatsappUrl?: string };
    const rates = Object.fromEntries(Object.entries(body.rates ?? {}).map(([key, value]) => [key, Math.max(0, Math.round(Number(value) || 0))]));
    const normalizedWhatsappUrl = normalizeWhatsappUrl(body.whatsappUrl ?? "");
    await ShippingSettings.upsert({ id: 1, rates: JSON.stringify(rates), advanceShipping: Boolean(body.advanceShipping), advanceAccountNumber: body.advanceAccountNumber?.trim() || null, advanceAccountTitle: body.advanceAccountTitle?.trim() || null, advanceAccountName: body.advanceAccountName?.trim() || null, logoUrl: body.logoUrl?.trim() || "/logo-web.png", storeAddress: body.storeAddress?.trim() || null, storePhone: body.storePhone?.trim() || null, storeEmail: body.storeEmail?.trim() || null, facebookUrl: body.facebookUrl?.trim() || null, instagramUrl: body.instagramUrl?.trim() || null, tiktokUrl: body.tiktokUrl?.trim() || null, whatsappUrl: normalizedWhatsappUrl || null });
    return NextResponse.json({ message: "Shipping settings saved." });
  } catch (error) {
    console.error("Shipping settings save failed:", error);
    return NextResponse.json({ message: "Unable to save shipping settings." }, { status: 500 });
  }
}