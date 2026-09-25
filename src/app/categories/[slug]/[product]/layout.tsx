import type { Metadata } from "next";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; product: string }> }): Promise<Metadata> {
  const { slug, product } = await params;
  const record = await Product.findOne({
    where: { slug: product, isActive: true },
    include: [{ model: Category, as: "category", attributes: ["name", "slug"] }],
    raw: true,
    nest: true,
  }) as { name?: string; brand?: string; description?: string; image?: string; price?: number; originalPrice?: number; category?: { name?: string; slug?: string } } | null;
  const name = record?.name ?? product.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const description = record?.description || `${record?.brand ? `${record.brand} ` : ""}${name} available at Ruman Mart. Shop online with delivery across Pakistan.`;
  const categorySlug = record?.category?.slug ?? slug;

  return {
    title: name,
    description,
    alternates: { canonical: `/categories/${categorySlug}/${product}` },
    openGraph: {
      type: "website",
      title: `${name} | Ruman Mart`,
      description,
      ...(record?.image ? { images: [{ url: record.image, alt: name }] } : {}),
    },
  };
}

export default function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
