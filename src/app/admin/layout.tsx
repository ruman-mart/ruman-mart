import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ruman Mart Admin",
  description: "Ruman Mart store administration console.",
  icons: {
    icon: [{ url: "/favicon.jpeg", type: "image/jpeg" }],
    shortcut: ["/favicon.jpeg"],
    apple: ["/favicon.jpeg"],
  },
};

export default function AdminLayout() {
  redirect("/ruman-admin-hub");
  return null;
}