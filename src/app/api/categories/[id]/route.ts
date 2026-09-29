import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import sequelize from "@/lib/db";
import { runMigrations } from "@/lib/migrations";
import { deleteStoredImage } from "@/lib/storage";
import { getAuthenticatedUserId } from "@/lib/auth";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
  await category.update({ name: body.name?.trim(), slug: body.slug === undefined ? undefined : slugify(body.slug), image: body.image?.trim(), description: body.description?.trim(), isActive: body.isActive, isFeatured: body.isFeatured });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const category = await Category.findByPk((await params).id);
  if (!category) return NextResponse.json({ message: "Category not found." }, { status: 404 });
  const imageUrl = String(category.get("image"));
  let productImageUrls: string[];
  try {
    productImageUrls = await sequelize.transaction(async (transaction) => {
      const products = await Product.findAll({
        where: { categoryId: category.get("id") },
        attributes: ["image", "images"],
        transaction,
      });
      const imageUrls = products.flatMap((product) => {
        const image = String(product.get("image") ?? "");
        let images: string[] = [];
        try {
          const parsed = JSON.parse(String(product.get("images") ?? "[]")) as unknown;
          if (Array.isArray(parsed)) images = parsed.filter((url): url is string => typeof url === "string");
        } catch {
          // Keep the primary image even when optional gallery data is malformed.
        }
        return [image, ...images].filter(Boolean);
      });
      await Product.destroy({ where: { categoryId: category.get("id") }, transaction });
      await category.destroy({ transaction });
      return imageUrls;
    });
  } catch (error) {
    if (error instanceof Error && error.name === "SequelizeForeignKeyConstraintError") {
      return NextResponse.json(
        { message: "Unable to delete this category and its products. Please try again." },
        { status: 409 },
      );
    }
    throw error;
  }
  await Promise.all(
    [...new Set([imageUrl, ...productImageUrls])].map(async (url) => {
      try {
        await deleteStoredImage(url);
      } catch (error) {
        console.error("Category image cleanup failed:", error);
      }
    }),
  );
  return NextResponse.json({ message: "Category deleted." });
}