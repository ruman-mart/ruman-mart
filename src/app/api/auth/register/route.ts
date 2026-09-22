import { NextResponse } from "next/server";
import { hashPassword, normalizeEmail } from "@/lib/auth";
import { runMigrations } from "@/lib/migrations";
import User from "@/lib/models/User";

type RegisterBody = { fullName?: string; email?: string; phone?: string; password?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;
    const fullName = body.fullName?.trim();
    const email = body.email ? normalizeEmail(body.email) : "";
    const phone = body.phone?.trim();
    const password = body.password ?? "";

    if (!fullName || !email || !phone || password.length < 8) {
      return NextResponse.json({ message: "Please complete all fields. Password must be at least 8 characters." }, { status: 400 });
    }

    await runMigrations();
    const passwordHash = await hashPassword(password);
    await User.create({ fullName, email, phone, passwordHash });
    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  } catch (error) {
    const databaseError = error as { name?: string; original?: { code?: string } };
    if (databaseError.name === "SequelizeUniqueConstraintError" || databaseError.original?.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }
    console.error("Registration failed:", error);
    return NextResponse.json({ message: "Unable to create account right now.", code: databaseError.original?.code ?? databaseError.name ?? "UNKNOWN_DATABASE_ERROR" }, { status: 500 });
  }
}