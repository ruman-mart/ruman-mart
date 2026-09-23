import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse electronics, homeware, kitchen accessories, perfumes, watches and more from Ruman Mart.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}