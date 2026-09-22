import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { runMigrations } from "@/lib/migrations";

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function authorized() { return cookies().then((store) => Boolean(store.get("ruman_session")?.value)); }

export async function GET() {
  await runMigrations();
  const products = await Product.findAll({ include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }], order: [["createdAt", "DESC"]], raw: true, nest: true });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as {
      name?: string;
      slug?: string;
      brand?: string;
      categoryId?: number;
      price?: number;
      originalPrice?: number;
      image?: string;
      images?: string[];
      colors?: string[];
      storageOptions?: string[];
      quickSpecs?: Array<string | { label: string; sub?: string }>;
      keyFeatures?: string[];
      inStock?: boolean;
      stockQuantity?: number;
      isFeatured?: boolean;
      isNewArrival?: boolean;
      isDeal?: boolean;
    };
    if (!body.name || !body.brand || !body.categoryId || !body.price || !body.originalPrice) return NextResponse.json({ message: "Please complete all product fields." }, { status: 400 });
    const product = await Product.create({ ...body, image: body.image ?? "", images: JSON.stringify(body.images ?? []), colors: JSON.stringify(body.colors ?? []), storageOptions: JSON.stringify(body.storageOptions ?? []), quickSpecs: JSON.stringify(body.quickSpecs ?? []), keyFeatures: JSON.stringify(body.keyFeatures ?? []), slug: slugify(body.slug || body.name) });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "SequelizeUniqueConstraintError") return NextResponse.json({ message: "A product with this slug already exists." }, { status: 409 });
    console.error("Product create failed:", error);
    return NextResponse.json({ message: "Unable to create product." }, { status: 500 });
  }
}