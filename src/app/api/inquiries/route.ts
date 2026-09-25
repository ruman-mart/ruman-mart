import { NextResponse } from "next/server";
import Inquiry from "@/lib/models/Inquiry";
import { runMigrations } from "@/lib/migrations";
import { getAuthenticatedUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await runMigrations();
    const body = await request.json() as { name?: string; email?: string; phone?: string; subject?: string; message?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
    }

    const inquiry = await Inquiry.create({ name, email, phone: body.phone?.trim() || null, subject, message });
    return NextResponse.json({ id: inquiry.get("id") }, { status: 201 });
  } catch (error) {
    console.error("Inquiry creation failed:", error);
    return NextResponse.json({ message: "Unable to send inquiry." }, { status: 500 });
  }
}

export async function GET() {
  if (!(await getAuthenticatedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const inquiries = await Inquiry.findAll({ order: [["createdAt", "DESC"]], raw: true });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Inquiry loading failed:", error);
    return NextResponse.json({ message: "Unable to load inquiries." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await getAuthenticatedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as { id?: number; status?: "New" | "Read" | "Resolved" };
    if (!body.id || !body.status) return NextResponse.json({ message: "Inquiry and status are required." }, { status: 400 });
    const inquiry = await Inquiry.findByPk(body.id);
    if (!inquiry) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    await inquiry.update({ status: body.status });
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Inquiry update failed:", error);
    return NextResponse.json({ message: "Unable to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getAuthenticatedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as { id?: number };
    if (!body.id) return NextResponse.json({ message: "Inquiry is required." }, { status: 400 });
    const inquiry = await Inquiry.findByPk(body.id);
    if (!inquiry) return NextResponse.json({ message: "Inquiry not found." }, { status: 404 });
    await inquiry.destroy();
    return NextResponse.json({ message: "Inquiry deleted." });
  } catch (error) {
    console.error("Inquiry deletion failed:", error);
    return NextResponse.json({ message: "Unable to delete inquiry." }, { status: 500 });
  }
}
