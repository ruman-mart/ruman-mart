import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/deals" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/products" || route === "/categories" ? 0.9 : 0.6,
  }));
}