import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Ruman Mart",
  description: "Get in touch with Ruman Mart for product questions, order support and delivery help across Pakistan.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}