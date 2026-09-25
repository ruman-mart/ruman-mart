import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { normalizeEmail, verifyPassword } from "@/lib/auth";
import { runMigrations } from "@/lib/migrations";
import User from "@/lib/models/User";

type LoginBody = { email?: string; password?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email ? normalizeEmail(body.email) : "";
    const password = body.password ?? "";
    if (!email || !password) return NextResponse.json({ message: "Email and password are required." }, { status: 400 });

    await runMigrations();
    const user = await User.findOne({ where: { email }, attributes: ["id", "passwordHash"] });
    if (!user || !(await verifyPassword(password, String(user.get("passwordHash"))))) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("ruman_session", String(user.get("id")), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return NextResponse.json({ message: "Signed in successfully." });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ message: "Unable to sign in right now." }, { status: 500 });
  }
}
