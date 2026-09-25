import type { MetadataRoute } from "next";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rumanmart.com";
  const routes = [
    "",
    "/products",
    "/categories",
    "/categories/electronics",
    "/deals",
    "/new-arrivals",
    "/about",
    "/contact",
    "/help-center",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/deals" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1 : route === "/products" || route === "/categories" ? 0.9 : 0.6,
  }));

  try {
    const [categories, products] = await Promise.all([
      Category.findAll({ where: { isActive: true }, attributes: ["slug"], raw: true }) as unknown as Promise<Array<{ slug: string }>>,
      Product.findAll({ where: { isActive: true }, include: [{ association: "category", attributes: ["slug"] }], attributes: ["slug", "updatedAt"], raw: true, nest: true }) as unknown as Promise<Array<{ slug: string; updatedAt?: Date; category?: { slug?: string } }>>,
    ]);

    entries.push(
      ...categories.map((category) => ({ url: `${baseUrl}/categories/${category.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
      ...products.filter((product) => product.category?.slug).map((product) => ({ url: `${baseUrl}/categories/${product.category?.slug}/${product.slug}`, lastModified: product.updatedAt ?? new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    );
  } catch {
    // Keep static sitemap entries available if the database is temporarily unavailable.
  }

  return entries;
}