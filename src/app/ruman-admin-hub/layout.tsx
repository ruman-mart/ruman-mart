import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ruman Mart Admin",
  description: "Ruman Mart store administration console.",
  icons: {
    icon: [{ url: "/favicon.svg?v=1", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg?v=1"],
    apple: ["/favicon.svg?v=1"],
  },
};

export default async function SecureAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await getAuthenticatedUserId())) {
    redirect("/ruman-login-hub");
  }

  return children;
}
