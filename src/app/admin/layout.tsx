import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get("ruman_session");

  if (!session?.value) {
    redirect("/login");
  }

  return children;
}