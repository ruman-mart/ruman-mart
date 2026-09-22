import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Category from "@/lib/models/Category";
import { runMigrations } from "@/lib/migrations";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireAdmin() {
  return Boolean((await cookies()).get("ruman_session")?.value);
}

export async function GET() {
  await runMigrations();
  const categories = await Category.findAll({ where: { isActive: true }, order: [["createdAt", "DESC"]], raw: true });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = (await request.json()) as { name?: string; slug?: string; image?: string; description?: string; isFeatured?: boolean };
    const name = body.name?.trim();
    const image = body.image?.trim();
    if (!name || !image) return NextResponse.json({ message: "Name and image are required." }, { status: 400 });
    const category = await Category.create({ name, slug: slugify(body.slug || name), image, description: body.description?.trim() || null, isFeatured: Boolean(body.isFeatured) });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "SequelizeUniqueConstraintError") return NextResponse.json({ message: "A category with this slug already exists." }, { status: 409 });
    console.error("Category create failed:", error);
    return NextResponse.json({ message: "Unable to create category." }, { status: 500 });
  }
}