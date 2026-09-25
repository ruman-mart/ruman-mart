import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rumanmart.com";

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ruman-admin-hub", "/ruman-login-hub", "/admin-not-found", "/api/", "/cart", "/checkout", "/wishlist", "/orders/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}