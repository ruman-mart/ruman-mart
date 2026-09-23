import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ruman Mart Admin",
  description: "Ruman Mart store administration console.",
  icons: {
    icon: [{ url: "/favicon.svg?v=1", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg?v=1"],
    apple: ["/favicon.svg?v=1"],
  },
};

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get("ruman_session");

  if (!session?.value) {
    redirect("/login");
  }

  return children;
}