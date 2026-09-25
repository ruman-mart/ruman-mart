import type { Metadata } from "next";
import Category from "@/lib/models/Category";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await Category.findOne({ where: { slug, isActive: true }, raw: true }) as { name?: string; description?: string; image?: string } | null;
  const name = category?.name ?? slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const description = category?.description ?? `Shop ${name} products at Ruman Mart with reliable delivery across Pakistan.`;
  const image = category?.image;

  return {
    title: `${name} Products`,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      type: "website",
      title: `${name} Products | Ruman Mart`,
      description,
      ...(image ? { images: [{ url: image, alt: name }] } : {}),
    },
  };
}

export default function CategoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
