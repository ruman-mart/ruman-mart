import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rumanmart.com";

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cart", "/checkout", "/login", "/wishlist", "/orders/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}