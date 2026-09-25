import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { runMigrations } from "@/lib/migrations";
import { deleteStoredImage } from "@/lib/storage";
import { getAuthenticatedUserId } from "@/lib/auth";

async function authorized() {
  return Boolean(await getAuthenticatedUserId());
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const { id } = await params;
  const category = await Category.findByPk(id);
  if (!category) return NextResponse.json({ message: "Category not found." }, { status: 404 });
  const body = (await request.json()) as { name?: string; slug?: string; image?: string; description?: string; isActive?: boolean; isFeatured?: boolean };
  await category.update({ name: body.name?.trim(), slug: body.slug?.trim(), image: body.image?.trim(), description: body.description?.trim(), isActive: body.isActive, isFeatured: body.isFeatured });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const category = await Category.findByPk((await params).id);
  if (!category) return NextResponse.json({ message: "Category not found." }, { status: 404 });
  const imageUrl = String(category.get("image"));
  await category.destroy();
  try {
    await deleteStoredImage(imageUrl);
  } catch (error) {
    console.error("Category image cleanup failed:", error);
  }
  return NextResponse.json({ message: "Category deleted." });
}