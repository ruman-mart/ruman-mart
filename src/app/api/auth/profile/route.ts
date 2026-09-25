import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { runMigrations } from "@/lib/migrations";

async function getSessionUser() {
  const sessionId = (await cookies()).get("ruman_session")?.value;
  if (!sessionId || !/^\d+$/.test(sessionId)) return null;
  await runMigrations();
  return User.findByPk(sessionId, { attributes: ["id", "fullName", "passwordHash", "avatarUrl"] });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ fullName: String(user.get("fullName")), avatarUrl: String(user.get("avatarUrl") ?? "") });
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { fullName?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string };
    const fullName = body.fullName?.trim() ?? "";
    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword ?? "";

    if (!fullName) return NextResponse.json({ message: "Name is required." }, { status: 400 });
    if (fullName.length > 120) return NextResponse.json({ message: "Name must be 120 characters or fewer." }, { status: 400 });
    if (newPassword && newPassword.length < 8) return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 });
    if (newPassword && !(await verifyPassword(currentPassword, String(user.get("passwordHash"))))) {
      return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
    }

    const updates: { fullName: string; avatarUrl?: string | null; passwordHash?: string } = { fullName, avatarUrl: body.avatarUrl?.trim() || null };
    if (newPassword) updates.passwordHash = await hashPassword(newPassword);
    await user.update(updates);

    return NextResponse.json({ message: "Admin account updated successfully.", fullName, avatarUrl: String(user.get("avatarUrl") ?? "") });
  } catch (error) {
    console.error("Admin profile update failed:", error);
    return NextResponse.json({ message: "Unable to update admin account." }, { status: 500 });
  }
}
