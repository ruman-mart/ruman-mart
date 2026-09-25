"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  Banknote,
  ShieldCheck,
  Headset,
  Lock,
  Pencil,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type OrderItem = {
  id: string;
  productSlug?: string;
  name: string;
  specs: string[];
  qty: number;
  price: number;
  image: string;
};

const CART_STORAGE_KEY = "ruman-cart";

type ProvinceId = "punjab" | "sindh" | "khyber-pakhtunkhwa" | "balochistan" | "islamabad" | "azad-kashmir" | "gilgit-baltistan";

const defaultShippingRates: { id: ProvinceId; label: string; price: number; note: string }[] = [
  { id: "punjab", label: "Punjab", price: 250, note: "Rs. 250 per 1kg parcel" },
  { id: "sindh", label: "Sindh", price: 200, note: "Rs. 200 per 1kg parcel" },
  { id: "khyber-pakhtunkhwa", label: "Khyber Pakhtunkhwa", price: 300, note: "Rs. 300 per 1kg parcel" },
  { id: "balochistan", label: "Balochistan", price: 350, note: "Rs. 350 per 1kg parcel" },
  { id: "islamabad", label: "Islamabad Capital Territory", price: 250, note: "Rs. 250 per 1kg parcel" },
  { id: "azad-kashmir", label: "Azad Jammu and Kashmir", price: 350, note: "Rs. 350 per 1kg parcel" },
  { id: "gilgit-baltistan", label: "Gilgit-Baltistan", price: 450, note: "Rs. 450 per 1kg parcel" },
];

const citiesByProvince: Record<ProvinceId, string[]> = {
  punjab: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Gujrat", "Rahim Yar Khan", "Kasur", "Okara", "Sahiwal", "Attock", "Chakwal", "Mianwali", "Khushab", "Bhakkar", "Layyah", "Muzaffargarh", "Dera Ghazi Khan", "Hafizabad", "Mandi Bahauddin", "Nankana Sahib", "Wazirabad", "Kamoke", "Burewala", "Vehari", "Khanewal", "Lodhran", "Pakpattan", "Chiniot", "Toba Tek Singh", "Other city"],
  sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas", "Hala", "Hala Old", "Thatta", "Badin", "Tando Adam", "Tando Allahyar", "Matiari", "Dadu", "Jacobabad", "Shikarpur", "Khairpur", "Ghotki", "Kandhkot", "Kashmore", "Umerkot", "Sanghar", "Tharparkar", "Sehwan", "Kotri", "Jamshoro", "Naushahro Feroze", "Other city"],
  "khyber-pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Mingora", "Kohat", "Dera Ismail Khan", "Nowshera", "Charsadda", "Swabi", "Haripur", "Mansehra", "Bannu", "Lakki Marwat", "Tank", "Hangu", "Karak", "Chitral", "Dir", "Timergara", "Batkhela", "Buner", "Shangla", "Besham", "Parachinar", "Other city"],
  balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Chaman", "Sibi", "Zhob", "Loralai", "Dera Murad Jamali", "Dera Allah Yar", "Kalat", "Mastung", "Nushki", "Kharan", "Panjgur", "Awaran", "Lasbela", "Hub", "Dalbandin", "Pasni", "Ormara", "Other city"],
  islamabad: ["Islamabad", "Bara Kahu", "Tarnol", "Nilore", "Sihala", "Other city"],
  "azad-kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot", "Kotli", "Bagh", "Bhimber", "Mandi Bahauddin", "Pallandri", "Hattian Bala", "Neelum Valley", "Dhirkot", "Forward Kahuta", "Other city"],
  "gilgit-baltistan": ["Gilgit", "Skardu", "Chilas", "Hunza", "Ghizer", "Astore", "Diamer", "Ghanche", "Shigar", "Nagar", "Kharmang", "Darel", "Tangir", "Yasin", "Other city"],
};

const paymentMethods = [
  { id: "cod", Icon: Banknote, title: "Cash on Delivery", subtitle: "Pay when you receive your order" },
];

const trustNotes: { Icon: LucideIcon; title: string; subtitle: string }[] = [
  { Icon: ShieldCheck, title: "100% Secure Payments", subtitle: "Your data is safe with us" },
  { Icon: Truck, title: "Fast Delivery", subtitle: "Quick delivery to your doorstep" },
  { Icon: Headset, title: "24/7 Support", subtitle: "We're here to help" },
];

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function toWhatsappLink(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const normalized = digits.startsWith("92") ? digits.slice(0, 12) : digits.slice(0, 11);
  return normalized ? `https://wa.me/${normalized}` : "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const [province, setProvince] = useState<ProvinceId>("sindh");
  const [shippingRates, setShippingRates] = useState(defaultShippingRates);
  const [advanceShipping, setAdvanceShipping] = useState(false);
  const [advanceAccountNumber, setAdvanceAccountNumber] = useState("");
  const [advanceAccountTitle, setAdvanceAccountTitle] = useState("");
  const [advanceAccountName, setAdvanceAccountName] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [city, setCity] = useState(citiesByProvince.sindh[0]);
  const [otherCity, setOtherCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderError, setOrderError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetch("/api/settings/shipping")
      .then(async (response) => response.ok ? await response.json() as { rates: Record<string, number>; advanceShipping: boolean; advanceAccountNumber: string; advanceAccountTitle: string; advanceAccountName: string; whatsappUrl: string } : null)
      .then((settings) => {
        if (!settings) return;
        setShippingRates(defaultShippingRates.map((rate) => ({ ...rate, price: Number(settings.rates[rate.id] ?? rate.price), note: `Rs. ${Number(settings.rates[rate.id] ?? rate.price)} per 1kg parcel` })));
        const shippingAdvanceEnabled = Boolean(settings.advanceShipping);
        setAdvanceShipping(shippingAdvanceEnabled);
        setAdvanceAccountNumber(settings.advanceAccountNumber);
        setAdvanceAccountTitle(settings.advanceAccountTitle);
        setAdvanceAccountName(settings.advanceAccountName);
        setWhatsappUrl(settings.whatsappUrl || "");
        setPaymentMethod(shippingAdvanceEnabled ? "advance-shipping" : "cod");
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as Array<{
        id: string;
        productSlug?: string;
        name: string;
        specs?: string[];
        quantity: number;
        price: number;
        image: string;
      }>;
      setOrderItems(stored.map((item) => ({
        id: item.id,
        productSlug: item.productSlug,
        name: item.name,
        specs: item.specs ?? [],
        qty: item.quantity,
        price: item.price,
        image: item.image,
      })));
    } catch {
      setOrderItems([]);
    }
  }, []);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const provinceShippingRate = shippingRates.find((r) => r.id === province)?.price ?? 0;
  const shippingDisplayCost = provinceShippingRate;
  const shippingCost = advanceShipping ? 0 : shippingDisplayCost;
  const discount = 0;
  const total = subtotal + shippingCost - discount;
  const whatsappLink = toWhatsappLink(whatsappUrl);
  const availablePaymentMethods = advanceShipping
    ? [{ id: "advance-shipping", Icon: Truck, title: "Shipping Advance", subtitle: "Pay shipping charges in advance" }]
    : paymentMethods;

  async function handlePlaceOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orderItems.length || submitting) return;
    setOrderError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        province: shippingRates.find((rate) => rate.id === province)?.label ?? province,
        city: city === "Other city" ? otherCity : city,
        postalCode: formData.get("postalCode"),
        country: formData.get("country"),
        items: orderItems,
        subtotal,
        shippingCost,
        discount,
        total,
        paymentMethod,
      }),
    });
    const result = await response.json().catch(() => ({})) as { message?: string; orderNumber?: string };
    if (!response.ok) {
      setOrderError(result.message ?? "Unable to place order.");
      setSubmitting(false);
      return;
    }

    const orderSnapshot = {
      orderNumber: result.orderNumber ?? `RM-${Date.now().toString().slice(-8)}`,
      orderDate: new Date().toISOString(),
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      province: shippingRates.find((rate) => rate.id === province)?.label ?? province,
      city: city === "Other city" ? otherCity : city,
      postalCode: formData.get("postalCode"),
      country: formData.get("country") ?? "Pakistan",
      paymentMethod,
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      total,
    };

    sessionStorage.setItem("ruman-last-order", JSON.stringify(orderSnapshot));
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("ruman-cart-updated"));
    router.push(`/order-success?order=${encodeURIComponent(orderSnapshot.orderNumber)}`);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-8">
          {/* Back link */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0b75a5]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Cart
          </Link>

          {/* Header + step indicator */}
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">Checkout</h1>
              <p className="mt-1 text-sm text-slate-500">
                Complete your order and get your products delivered.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {[
                { step: 1, label: "Shipping Details" },
                { step: 2, label: "Place Order" },
              ].map((s, i, arr) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        s.step === 1
                          ? "bg-[#19c9ee] text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {s.step}
                    </span>
                    <span
                      className={`hidden text-xs font-medium sm:block ${
                        s.step === 1 ? "text-[#0b1d45]" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="h-px w-6 bg-slate-200 sm:w-10" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left: form */}
            <div className="flex flex-col gap-6">
              {/* Contact Information */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#19c9ee] text-xs font-bold text-white">
                    1
                  </span>
                  <h2 className="text-base font-bold text-[#0b1d45]">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                </div>

                  <div className="mt-6 mb-4 flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b1d45]/10 text-xs font-bold text-[#0b1d45]">
                    <Truck size={13} aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-bold text-[#0b1d45]">Shipping Address</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="House #, Street, Area"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>

                  {/* Province select — drives shipping cost */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <MapPin size={13} className="text-[#0b75a5]" aria-hidden="true" />
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => {
                        const nextProvince = e.target.value as ProvinceId;
                        setProvince(nextProvince);
                        setCity(citiesByProvince[nextProvince][0]);
                        setOtherCity("");
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    >
                      {shippingRates.map((rate) => (
                        <option key={rate.id} value={rate.id}>{rate.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    >
                      {citiesByProvince[province].map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {city === "Other city" && (
                      <input
                        type="text"
                        value={otherCity}
                        required
                        onChange={(e) => setOtherCity(e.target.value)}
                        placeholder="Type your city"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Postal Code (optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="54000"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Country *
                    </label>
                    <select name="country" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-[#19c9ee] focus:outline-none focus:ring-2 focus:ring-[#19c9ee]/30">
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#19c9ee] text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="text-base font-bold text-[#0b1d45]">Shipping Method</h2>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#19c9ee] bg-[#e6f7fc] p-3.5">
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="shrink-0 text-[#0b75a5]" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-[#0b1d45]">
                        {advanceShipping ? "Shipping Advance" : "Standard Delivery — Across Pakistan"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {advanceShipping
                          ? `Shipping charge: ${formatPrice(shippingDisplayCost)} · pay in advance`
                          : `${shippingRates.find((r) => r.id === province)?.note} · ${shippingRates.find((r) => r.id === province)?.label}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#0b1d45]">
                    {formatPrice(shippingDisplayCost)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Shipping rate updates automatically based on the selected
                  province or region.
                </p>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#19c9ee] text-xs font-bold text-white">
                    3
                  </span>
                  <h2 className="text-base font-bold text-[#0b1d45]">Payment Method</h2>
                </div>

                <div className="flex flex-col gap-3">
                  {availablePaymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-colors ${
                        paymentMethod === method.id
                          ? "border-[#19c9ee] bg-[#e6f7fc]"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment-method"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="h-4 w-4 accent-[#19c9ee]"
                        />
                        <method.Icon size={18} className="shrink-0 text-[#0b75a5]" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-bold text-[#0b1d45]">{method.title}</p>
                          <p className="text-xs text-slate-500">{method.subtitle}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {advanceShipping && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
                    <div className="px-3.5 py-3 text-xs text-amber-800">
                      <p className="font-bold">Advance Payment Details</p>
                      {advanceAccountName && <p className="mt-1">Account Name: {advanceAccountName}</p>}
                      {advanceAccountTitle && <p className="mt-1">{advanceAccountTitle}</p>}
                      {advanceAccountNumber && <p className="mt-0.5 font-semibold">Account No: {advanceAccountNumber}</p>}
                    </div>
                    <a
                      href={whatsappLink || "#"}
                      target={whatsappLink ? "_blank" : undefined}
                      rel={whatsappLink ? "noopener noreferrer" : undefined}
                      onClick={whatsappLink ? undefined : (event) => event.preventDefault()}
                      className="flex items-center justify-between gap-2 border-t border-amber-200 bg-[#25D366]/10 px-3.5 py-3 text-xs font-semibold text-[#0b1d45] transition-colors hover:bg-[#25D366]/20"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                          <MessageCircle size={14} aria-hidden="true" />
                        </span>
                        <span>
                          After payment, send your screenshot on WhatsApp
                          <br />
                          <span className="text-[#128C7E]">to confirm your order</span>
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md bg-[#25D366] px-2.5 py-1.5 text-[11px] font-bold text-white">
                        Send on WhatsApp
                      </span>
                    </a>
                  </div>
                )}

                <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#e6f7fc] px-3.5 py-2.5 text-xs text-[#0b75a5]">
                  <ShieldCheck size={15} className="shrink-0" aria-hidden="true" />
                  Pay safely in cash when your order is delivered.
                </p>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="flex flex-col gap-4">
              <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0b1d45]">Order Summary</h2>
                  <Link
                    href="/cart"
                    className="flex items-center gap-1 text-xs font-semibold text-[#0b75a5] hover:text-[#064d70]"
                  >
                    <Pencil size={12} aria-hidden="true" />
                    Edit Cart
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  {orderItems.length === 0 ? (
                    <p className="rounded-lg bg-[#f5f7fb] px-3 py-4 text-sm text-slate-500">
                      Your cart is empty. Add a product before placing an order.
                    </p>
                  ) : orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f5f7fb] p-1.5">
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#0b1d45]">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.specs.join(" · ") || "Product"} · Qty: {item.qty}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#0b1d45]">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal ({orderItems.reduce((sum, item) => sum + item.qty, 0)} items)</span>
                    <span className="font-semibold text-[#0b1d45]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {!advanceShipping && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>
                        Shipping Charges
                        <span className="ml-1 text-xs text-slate-400">
                          ({shippingRates.find((r) => r.id === province)?.label})
                        </span>
                      </span>
                      <span className="font-semibold text-[#0b1d45]">
                        {formatPrice(advanceShipping ? 0 : shippingDisplayCost)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600">
                      - {formatPrice(discount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm font-bold text-[#0b1d45]">Total Amount</span>
                  <span className="text-xl font-bold text-[#0b75a5]">
                    {formatPrice(total)}
                  </span>
                </div>

                {orderItems.length > 0 ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#19c9ee] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0db4d8] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Lock size={15} aria-hidden="true" />
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                ) : (
                  <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-300 py-3 text-sm font-semibold text-white">
                    <Lock size={15} aria-hidden="true" />
                    Place Order
                  </span>
                )}
                {orderError && <p className="mt-3 text-sm text-rose-600">{orderError}</p>}
              </div>

              {/* Trust notes */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3.5">
                  {trustNotes.map(({ Icon, title, subtitle }) => (
                    <div key={title} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e6f7fc] text-[#0b75a5]">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0b1d45]">
                          {title}
                        </p>
                        <p className="truncate text-xs text-slate-500">{subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}