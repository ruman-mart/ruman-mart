import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Grid3x3,
  Headset,
  List,
  Home as HomeIcon,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WishlistButton from "../../components/WishlistButton";
import CategoryModel from "@/lib/models/Category";
import ProductModel from "@/lib/models/Product";

type Product = {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};

type Category = {
  name: string;
  description: string;
  heroTitle?: string;
  heroDescription?: string;
  totalProducts: number;
  products: Product[];
};

const categoryData: Record<string, Category> = {
  electronics: {
    name: "Electronics",
    description: "Smart devices and everyday technology made for modern life.",
    heroTitle: "Latest Gadgets & Devices",
    heroDescription:
      "Stay connected, work smarter, and live better with our premium range of electronics.",
    totalProducts: 152,
    products: [
      { name: "Laptop 15.6\" Full HD", brand: "HP", price: 89999, originalPrice: 142999, rating: 4.6, reviews: 1200, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80" },
      { name: "Wireless Earbuds", brand: "Apple", price: 7999, originalPrice: 12999, rating: 4.7, reviews: 2200, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80" },
      { name: "Smart Watch", brand: "Samsung", price: 12999, originalPrice: 18999, rating: 4.5, reviews: 742, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80" },
      { name: "Smartphone 256GB", brand: "Apple", price: 149999, originalPrice: 199999, rating: 4.8, reviews: 3900, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
      { name: "TWS Earphones", brand: "Boat", price: 6999, originalPrice: 9999, rating: 4.4, reviews: 5300, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80" },
      { name: "Gaming Laptop", brand: "Asus", price: 159999, originalPrice: 199999, rating: 4.7, reviews: 966, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" },
      { name: "Bluetooth Speaker", brand: "JBL", price: 14599, originalPrice: 19999, rating: 4.6, reviews: 1900, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" },
      { name: "Gaming PC (Desktop)", brand: "Dell", price: 79999, originalPrice: 97499, rating: 4.5, reviews: 620, image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80" },
      { name: "LED Monitor 24\"", brand: "Samsung", price: 34999, originalPrice: 44999, rating: 4.4, reviews: 936, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80" },
      { name: "Mechanical Keyboard", brand: "Redragon", price: 11999, originalPrice: 18999, rating: 4.6, reviews: 674, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" },
      { name: "Gaming Mouse", brand: "Logitech", price: 7599, originalPrice: 9999, rating: 4.8, reviews: 1100, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80" },
      { name: "Power Bank 20000mAh", brand: "Mi", price: 6999, originalPrice: 10499, rating: 4.6, reviews: 1400, image: "https://images.unsplash.com/photo-1609592424856-ecb9c1f5e1f5?w=800&q=80" },
      { name: "Action Camera", brand: "GoPro", price: 44999, originalPrice: 59999, rating: 4.7, reviews: 512, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" },
      { name: "WiFi Router", brand: "TP-Link", price: 8999, originalPrice: 11999, rating: 4.5, reviews: 1300, image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80" },
      { name: "Smart TV 43\"", brand: "TCL", price: 59999, originalPrice: 89999, rating: 4.6, reviews: 903, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80" },
      { name: "Noise Cancelling Earbuds", brand: "Sony", price: 19999, originalPrice: 27999, rating: 4.7, reviews: 828, image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800&q=80" },
    ],
  },
};

async function getCategory(slug: string): Promise<Category | undefined> {
  const databaseCategory = (await CategoryModel.findOne({ where: { slug, isActive: true }, raw: true })) as unknown as { id: number; name: string; description: string | null } | null;
  if (databaseCategory) {
    const databaseProducts = (await ProductModel.findAll({ attributes: ["name", "brand", "price", "originalPrice", "rating", "reviews", "image"], where: { categoryId: databaseCategory.id, isActive: true }, order: [["createdAt", "DESC"]], raw: true })) as unknown as Array<{ name: string; brand: string; price: number; originalPrice: number; rating: number | string; reviews: number; image: string }>;
    if (databaseProducts.length || !categoryData[slug]) {
      return {
        name: databaseCategory.name,
        description: databaseCategory.description ?? "Explore products from this collection.",
        totalProducts: databaseProducts.length,
        products: databaseProducts.map((product) => ({ name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, rating: Number(product.rating), reviews: product.reviews, image: product.image })),
      };
    }
  }
  return categoryData[slug];
}

export function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({ slug }));
}

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

function productSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const heroBenefits: { Icon: LucideIcon; title: string; text: string }[] = [
   { Icon: Truck, title: "Fast Delivery", text: "Quick delivery to your doorstep" },
  { Icon: ShieldCheck, title: "Secure Payments", text: "100% secure checkout" },
  { Icon: Headset, title: "24/7 Support", text: "We're here to help" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < Math.round(rating)
              ? "fill-[#f5a623] text-[#f5a623]"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const shownCount = category.products.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fb] text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
  <section className="relative isolate overflow-hidden bg-[#031a3b]">
  <div
    className="absolute inset-0 bg-[url('/mobile-hero.png')] bg-cover bg-center sm:hidden"
    aria-hidden="true"
  />

  <div
    className="absolute inset-0 hidden bg-[url('/hero.png')] bg-cover bg-center sm:block"
    aria-hidden="true"
  />

  {/* Dark Blue Overlay */}
  <div
    className="absolute inset-0 bg-[#031a3b]/50"
    aria-hidden="true"
  />

  <div className="relative mx-auto flex min-h-[400px] max-w-[1800px] items-center px-5 py-8 sm:min-h-[300px] md:min-h-[380px] md:px-8">
    
    {/* Breadcrumb - mobile par hidden */}
    <div className="absolute inset-x-5 top-0 hidden items-center gap-1.5 py-4 text-sm text-slate-300 sm:flex md:inset-x-8">
      <Link href="/" className="flex items-center gap-1 hover:text-white">
        <HomeIcon size={14} aria-hidden="true" />
        Home
      </Link>

      <ChevronRight
        size={14}
        className="text-slate-400"
        aria-hidden="true"
      />

      <span className="font-semibold text-white">
        {category.name}
      </span>
    </div>

    <div className="w-full min-w-0 max-w-xl text-white">
      <h1 className="text-[1.55rem] font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
        {category.name}
        <span className="block text-[#19d5f2]">
          {category.heroTitle ?? "Made for You"}
        </span>
      </h1>

      <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
        {category.heroDescription ?? category.description}
      </p>

      <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {heroBenefits.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon
              size={31}
              className="shrink-0 text-[#19d5f2]"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-slate-300">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        <div className="mx-auto max-w-[1800px] px-4 py-6 md:px-8">
          {/* Header bar */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1d45] sm:text-3xl">
                {category.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing 1-{shownCount} of {category.totalProducts} products
              </p>
            </div>

       <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
  <div className="relative min-w-0 flex-1 sm:flex-none">
    <select
      defaultValue="popularity"
      className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19c9ee] sm:w-auto sm:text-sm"
      aria-label="Sort by"
    >
      <option value="popularity">Sort by: Popularity</option>
      <option value="price-low">Sort by: Price - Low to High</option>
      <option value="price-high">Sort by: Price - High to Low</option>
      <option value="rating">Sort by: Rating</option>
      <option value="newest">Sort by: Newest</option>
    </select>

    <ChevronRight
      size={14}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
      aria-hidden="true"
    />
  </div>

  <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <button
      type="button"
      aria-label="Grid view"
      className="flex h-9 w-9 items-center justify-center bg-[#19c9ee] text-white"
    >
      <Grid3x3 size={16} aria-hidden="true" />
    </button>

    <button
      type="button"
      aria-label="List view"
      className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-slate-50"
    >
      <List size={16} aria-hidden="true" />
    </button>
  </div>
</div>
          </div>

    {/* Product grid */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  {category.products.map((product) => {
    const discount = Math.round(
      (1 - product.price / product.originalPrice) * 100
    );
    const hasDiscount = product.originalPrice > product.price && discount > 0;

    return (
      <article
        key={product.name}
        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative flex h-40 items-center justify-center bg-white px-4 pt-4">
          <WishlistButton product={product} />

          {hasDiscount && <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>}

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
          <h3 className="truncate text-sm font-bold text-[#0b1d45]">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500">
            {product.brand}
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#0b1d45]">
              {formatPrice(product.price)}
            </span>

            {hasDiscount && <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>}
          </div>

          <Link
            href={`/categories/${slug}/${productSlug(product.name)}`}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle_at_top,#2b5b9a_0%,#0b3268_55%,#06234d_100%)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Product
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  })}
</div>
          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            >
              <ChevronRight size={16} className="rotate-180" aria-hidden="true" />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                  page === 1
                    ? "bg-[#19c9ee] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-sm text-slate-400">...</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              10
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}