"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CART_STORAGE_KEY = "ruman-cart";

type Props = {
  productSlug: string;
  name: string;
  price: number;
  image: string;
  stockQuantity?: number;
  inStock?: boolean;
};

export default function AddToCartButton({ productSlug, name, price, image, stockQuantity = 999999, inStock = true }: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const available = inStock && stockQuantity > 0;

  function addToCart() {
    if (!available) return;
    let items: Array<{ id: string; productSlug: string; name: string; specs: string[]; price: number; quantity: number; inStock: boolean; stockQuantity: number; image: string }> = [];
    try { items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]"); } catch { items = []; }
    const existing = items.find((item) => item.productSlug === productSlug && !item.specs.length);
    if (existing) {
      existing.quantity = Math.min(stockQuantity, existing.quantity + 1);
    } else {
      items.push({ id: productSlug, productSlug, name, specs: [], price, quantity: 1, inStock, stockQuantity, image });
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("ruman-cart-updated"));
    setAdded(true);
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={!available}
      className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle_at_top,#2b5b9a_0%,#0b3268_55%,#06234d_100%)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:bg-none"
    >
      <ShoppingCart size={14} aria-hidden="true" />
      {!available ? "Out of Stock" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
