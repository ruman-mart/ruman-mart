import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { runMigrations } from "@/lib/migrations";
import { deleteStoredImage } from "@/lib/storage";

async function authorized() { return Boolean((await cookies()).get("ruman_session")?.value); }

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await runMigrations();
  const id = (await params).id;
  const product = await Product.findOne({ where: { slug: id, isActive: true }, include: [{ model: Category, as: "category", attributes: ["name", "slug"] }], raw: true, nest: true });
  if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const product = await Product.findByPk((await params).id);
  if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
  const body = await request.json() as {
    name?: string;
    slug?: string;
    brand?: string;
    categoryId?: number;
    price?: number;
    originalPrice?: number;
    image?: string;
    images?: string[] | string;
    colors?: string[] | string;
    storageOptions?: string[] | string;
    quickSpecs?: Array<string | { label: string; sub?: string }> | string;
    keyFeatures?: string[] | string;
    inStock?: boolean;
    stockQuantity?: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isDeal?: boolean;
  };
  await product.update({
    ...(body.name !== undefined ? { name: body.name } : {}),
    ...(body.slug !== undefined ? { slug: body.slug } : {}),
    ...(body.brand !== undefined ? { brand: body.brand } : {}),
    ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
    ...(body.price !== undefined ? { price: body.price } : {}),
    ...(body.originalPrice !== undefined ? { originalPrice: body.originalPrice } : {}),
    ...(body.image !== undefined ? { image: body.image } : {}),
    ...(body.inStock !== undefined ? { inStock: Boolean(body.inStock) } : {}),
    ...(body.stockQuantity !== undefined ? { stockQuantity: body.stockQuantity } : {}),
    ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
    ...(body.isNewArrival !== undefined ? { isNewArrival: Boolean(body.isNewArrival) } : {}),
    ...(body.isDeal !== undefined ? { isDeal: Boolean(body.isDeal) } : {}),
    ...(Array.isArray(body.images) ? { images: JSON.stringify(body.images) } : {}),
    ...(typeof body.images === "string" ? { images: body.images } : {}),
    ...(Array.isArray(body.colors) ? { colors: JSON.stringify(body.colors) } : {}),
    ...(typeof body.colors === "string" ? { colors: body.colors } : {}),
    ...(Array.isArray(body.storageOptions) ? { storageOptions: JSON.stringify(body.storageOptions) } : {}),
    ...(typeof body.storageOptions === "string" ? { storageOptions: body.storageOptions } : {}),
    ...(Array.isArray(body.quickSpecs) ? { quickSpecs: JSON.stringify(body.quickSpecs) } : {}),
    ...(typeof body.quickSpecs === "string" ? { quickSpecs: body.quickSpecs } : {}),
    ...(Array.isArray(body.keyFeatures) ? { keyFeatures: JSON.stringify(body.keyFeatures) } : {}),
    ...(typeof body.keyFeatures === "string" ? { keyFeatures: body.keyFeatures } : {}),
  });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const product = await Product.findByPk((await params).id);
  if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
  const image = String(product.get("image"));
  const images = (() => { try { return JSON.parse(String(product.get("images") ?? "[]")) as string[]; } catch { return []; } })();
  await product.destroy();
  await Promise.all([...new Set([image, ...images])].map((url) => deleteStoredImage(url)));
  return NextResponse.json({ message: "Product deleted." });
}