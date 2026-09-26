import {
  ArrowRight,
  ChevronRight,
  Headset,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,  Award, Lock,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WishlistButton from "./components/WishlistButton";
import CategoryModel from "@/lib/models/Category";
import ProductModel from "@/lib/models/Product";
import MarqueeStrip from "./components/MarqueeStrip";

export const dynamic = "force-dynamic";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Ruman Mart",
  url: "https://www.rumanmart.com",
  description: "Quality electronics, homeware, kitchen accessories, perfumes and watches at great prices.",
  areaServed: "PK",
  sameAs: [],
};

const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" },
  { name: "Homeware", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
  { name: "Kitchen Accessories", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80" },
  { name: "Style Gadgets", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&q=80" },
  { name: "Perfumes", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80" },
];
const checklistItems = [
  { Icon: ShieldCheck, label: "Best Quality Products" },
  { Icon: Award, label: "Trusted Brands" },
  { Icon: Lock, label: "Secure Shopping" },
  { Icon: Truck, label: "Fast Delivery" },
];
type Product = {
  productSlug: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  inStock?: boolean;
  stockQuantity?: number;
};

const featuredProducts: Product[] = [
  {
    productSlug: "wireless-earbuds",
    name: "Wireless Earbuds",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",
    rating: 4.6,
    reviews: 1200,
    price: 7999,
    originalPrice: 12999,
    discount: 38,
  },
  {
    productSlug: "smart-watch",
    name: "Smart Watch",
    category: "Style Gadgets",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    rating: 4.7,
    reviews: 856,
    price: 12999,
    originalPrice: 18999,
    discount: 32,
  },
  {
    productSlug: "air-fryer",
    name: "Air Fryer",
    category: "Kitchen Accessories",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    rating: 4.5,
    reviews: 742,
    price: 15499,
    originalPrice: 22999,
    discount: 32,
  },
  {
    productSlug: "comfort-bed-set",
    name: "Comfort Bed Set",
    category: "Homeware",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    rating: 4.8,
    reviews: 1100,
    price: 8999,
    originalPrice: 14999,
    discount: 33,
  },
  {
    productSlug: "mens-perfume",
    name: "Men's Perfume",
    category: "Perfumes",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    rating: 4.6,
    reviews: 843,
    price: 5999,
    originalPrice: 9999,
    discount: 40,
  },
  {
    productSlug: "luxury-watch",
    name: "Luxury Watch",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    rating: 4.7,
    reviews: 920,
    price: 18999,
    originalPrice: 28999,
    discount: 37,
  },
];
type PromoBanner = {
  title: string;
  tagline: string;
  discount: string;
  image: string;
};

const promoBanners: PromoBanner[] = [
  {
    title: "Electronics",
    tagline: "Latest Gadgets & Devices",
    discount: "Up to 40% Off",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1000&q=80",
  },
  {
    title: "Homeware",
    tagline: "Make Your Home Beautiful",
    discount: "Up to 50% Off",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80",
  },
  {
    title: "Kitchen Accessories",
    tagline: "Cook with Happiness",
    discount: "Up to 45% Off",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1000&q=80",
  },
  {
    title: "Style Gadgets",
    tagline: "Smart Living Made Easy",
    discount: "Up to 40% Off",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=1000&q=80",
  },
  {
    title: "Perfumes",
    tagline: "Fragrance That Defines You",
    discount: "Up to 50% Off",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=80",
  },
  {
    title: "Watches",
    tagline: "Timeless Elegance",
    discount: "Up to 45% Off",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80",
  },
];
type TrustBadge = {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
};

const trustBadges: TrustBadge[] = [
  {
    Icon: Truck,
    title: "Fast Delivery",
    subtitle: "Quick delivery to your doorstep",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% secure checkout",
  },
  {
    Icon: Award,
    title: "Quality Products",
    subtitle: "Carefully selected for you",
  },
  {
    Icon: Headset,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
];
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
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
export default async function Home() {
  let landingCategories = categories;
  let landingFeaturedProducts: Product[] = [];
  try {
    const featuredRows = (await CategoryModel.findAll({ where: { isActive: true, isFeatured: true }, order: [["createdAt", "DESC"]], raw: true })) as unknown as Array<{ name: string; image: string }>;
    if (featuredRows.length) landingCategories = featuredRows;
  } catch (error) {
    console.error("Featured categories could not load:", error);
  }
  try {
    const featuredRows = (await ProductModel.findAll({ where: { isActive: true, isFeatured: true }, include: [{ association: "category", attributes: ["name"] }], order: [["createdAt", "DESC"]], raw: true, nest: true })) as unknown as Array<{ slug: string; name: string; brand: string; price: number; originalPrice: number; rating: number | string; reviews: number; image: string; inStock: boolean; stockQuantity: number; category?: { name: string } }>;
    landingFeaturedProducts = featuredRows.map((product) => ({ productSlug: product.slug, name: product.name, category: product.category?.name ?? "", image: product.image, rating: Number(product.rating), reviews: product.reviews, price: product.price, originalPrice: product.originalPrice, discount: Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100)), inStock: product.inStock, stockQuantity: product.stockQuantity }));
  } catch (error) {
    console.error("Featured products could not load:", error);
  }

  const promoBannerData: PromoBanner[] = landingCategories.slice(0, 6).map((category, index) => {
    const fallback = promoBanners[index % promoBanners.length];
    return {
      title: category.name,
      tagline: fallback.tagline,
      discount: fallback.discount,
      image: category.image || fallback.image,
    };
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f7fb] font-sans text-slate-800 dark:bg-black">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <main className="flex-1">
      <section className="relative isolate overflow-hidden bg-[#031a3b]">
  <div
    className="absolute inset-0 bg-[url('/mobile-hero.webp')] bg-cover bg-center sm:hidden"
    aria-hidden="true"
  />

  <div
    className="absolute inset-0 hidden bg-[url('/hero.webp')] bg-cover bg-center sm:block"
    aria-hidden="true"
  />

  {/* Overlay */}
  <div
    className="absolute inset-0 bg-[#031a3b]/50"
    aria-hidden="true"
  />

  <div className="relative mx-auto flex min-h-[380px] max-w-[1800px] items-center px-5 py-8 sm:min-h-[360px] md:min-h-[470px] md:px-8 lg:min-h-[520px]">
    <div className="max-w-xl text-white">

      <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 sm:block sm:text-sm">
        Your one-stop shop
      </p>

      <h1 className="mt-16 text-[1.55rem] font-bold leading-[1.02] tracking-tight sm:mt-0 sm:text-5xl lg:text-6xl">
        Everything You Need
        <span className="block text-[#19d5f2]">
          Under One Roof
        </span>
      </h1>

      <p className="mt-5 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
        Electronics, homeware, kitchen accessories, style gadgets,
        perfumes and all types of watches.
      </p>

      <p className="mt-3 text-xs font-medium text-slate-300 sm:text-sm">
        Best quality
        <span className="px-2 text-[#19d5f2]">•</span>
        Trusted brands
        <span className="px-2 text-[#19d5f2]">•</span>
        Fast delivery
      </p>

      <Link
        href="/categories"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#19c9ee] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-950/30 transition-colors hover:bg-[#0db4d8] sm:px-7 sm:py-3 sm:text-sm"
      >
        Shop Now
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

    </div>
  </div>
</section>
<MarqueeStrip />
      {/* Categories */}
<section className="border-b border-slate-200 bg-white py-7 sm:py-9">
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardShine {
      0% { transform: translateX(-120%) skewX(-15deg); }
      100% { transform: translateX(220%) skewX(-15deg); }
    }

    .anim-fade-up {
      opacity: 0;
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .cat-card {
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }
    .cat-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.5px;
      background: linear-gradient(135deg, #19c9ee, #0b75a5, transparent 60%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: 2;
    }
    .cat-card:hover::before {
      opacity: 1;
    }
    .cat-card-shine {
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(
        110deg,
        transparent 0%,
        rgba(255, 255, 255, 0.55) 50%,
        transparent 100%
      );
      transform: translateX(-120%) skewX(-15deg);
      pointer-events: none;
      z-index: 3;
    }
    .cat-card:hover .cat-card-shine {
      animation: cardShine 0.9s ease forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .anim-fade-up, .cat-card-shine {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `}</style>

  <div className="mx-auto max-w-[1800px] px-4 md:px-8">
    {/* Header row with View All button */}
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold text-[#0b1d45] sm:text-xl">
        Shop by Category
      </h2>
      <Link
        href="/categories"
        className="group inline-flex items-center gap-1 text-xs font-semibold text-[#0b75a5] transition-colors hover:text-[#064d70] sm:text-sm"
      >
        View All
        <ChevronRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>

    <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
      {landingCategories.map(({ name, image }, index) => (
        <a
          key={name}
          href={`/categories/${name.toLowerCase().replaceAll(" ", "-")}`}
          className="cat-card anim-fade-up group relative flex min-w-[220px] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(11,29,69,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(11,117,165,0.28)] sm:min-w-0"
          style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
        >
          {/* Shine sweep on hover */}
          <span className="cat-card-shine" aria-hidden="true" />

          {/* Image */}
          <div className="relative h-36 w-full overflow-hidden bg-white sm:h-40">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Bottom gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031a3b]/55 via-[#031a3b]/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Name overlay on image (bottom) */}
            <div className="absolute inset-x-0 bottom-0 px-3.5 pb-2.5">
              <p className="truncate text-sm font-bold text-white drop-shadow-sm">
                {name}
              </p>
            </div>
          </div>

          {/* Footer row */}
          <div className="relative flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-3">
            <span className="truncate text-xs font-semibold text-slate-500 transition-colors group-hover:text-[#0b75a5]">
              Shop now
            </span>
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6f7fc] text-[#0b75a5] transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#19c9ee] group-hover:to-[#0b75a5] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#19c9ee]/40">
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

        {/* Featured Products */}
        <section className="bg-[#f7fafc] py-8 sm:py-10">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0b1d45] sm:text-xl">
                  Featured Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Trending products, handpicked for you
                </p>
              </div>
              <a
                href="/products"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0b75a5] hover:text-[#064d70] sm:text-sm"
              >
                View All <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-6">
              {landingFeaturedProducts.slice(0, 6).map((product) => (
                <div
                  key={product.name}
                  className="group relative flex min-w-[200px] snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-w-0"
                >
                  <Link
                    href={`/categories/${product.category.toLowerCase().replaceAll(" ", "-")}/${product.productSlug}`}
                    aria-label={`View ${product.name} details`}
                    className="absolute inset-0 z-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b75a5]"
                  />
                  <div className="relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-white">
                    <WishlistButton product={product} />
                    {product.originalPrice > product.price && product.discount > 0 && <span className="absolute right-2 top-2 rounded-full bg-[#0b75a5] px-2 py-0.5 text-[11px] font-bold text-white">
                        -{product.discount}%
                      </span>}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
                    <h3 className="truncate text-sm font-bold text-[#0b1d45]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500">{product.category}</p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#0b1d45]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && product.discount > 0 && <span className="text-xs text-slate-400 line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>}
                    </div>

                    <Link
                      href={`/categories/${product.category.toLowerCase().replaceAll(" ", "-")}/${product.productSlug}`}
                      className="relative z-20 mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle_at_top,#2b5b9a_0%,#0b3268_55%,#06234d_100%)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      View Product <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[1800px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promoBannerData.map((banner) => (
            <a
              key={banner.title}
              href={`/categories/${banner.title.toLowerCase().replaceAll(" ", "-")}`}
              className="group relative flex h-40 overflow-hidden rounded-xl bg-gradient-to-br from-[#0b1d45] via-[#0e2a5e] to-[#031633] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:h-44"
            >
              {/* Text content */}
              <div className="relative z-10 flex w-3/5 flex-col justify-center gap-2 px-5">
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {banner.title}
                </h3>
                <p className="text-xs text-slate-300 sm:text-sm">
                  {banner.tagline}
                </p>
                <p className="text-sm font-bold text-[#19d5f2] sm:text-base">
                  {banner.discount}
                </p>
                <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#19c9ee] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-[#0db4d8]">
                  Shop Now <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>

              {/* Product image */}
              <div className="absolute inset-y-0 right-0 w-3/5">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d45] via-[#0b1d45]/20 to-transparent" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
     <section className="bg-[#f5f7fb] py-6 sm:py-8">
      <div className="mx-auto max-w-[1800px] px-4 md:px-8">
        <div className="grid grid-cols-2 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {trustBadges.map(({ Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:py-5"
            >
              <Icon
                size={32}
                strokeWidth={1.8}
                className="shrink-0 text-[#0DB4D8]"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0b1d45]">
                  {title}
                </p>
                <p className="truncate text-xs text-slate-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
     <section className="relative isolate overflow-hidden bg-gradient-to-r from-[#031633] via-[#0b1d45] to-[#0e2a5e] py-8 sm:py-10">
      <div className="mx-auto max-w-[1800px] px-4 md:px-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">
          {/* Left: text + CTA */}
          <div className="w-full shrink-0 text-center lg:w-[26%] lg:text-left">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              Smart Shopping
              <span className="block text-[#19d5f2]">Better Living</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-300 lg:mx-0">
              Ruman Mart brings you the best products, great prices and a
              seamless shopping experience. Shop now and upgrade your
              lifestyle!
            </p>
            <a
              href="/products"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#19c9ee] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/30 transition-colors hover:bg-[#0db4d8]"
            >
              Start Shopping <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          {/* Center: product image */}
          <div className="w-full lg:flex-1">
            <img
              src="about.webp"
              alt="Featured products - laptop, headphones, perfume, air fryer, watches"
              className="mx-auto h-40 w-full max-w-2xl object-contain sm:h-52 lg:h-56"
            />
          </div>

          {/* Right: checklist box */}
          <div className="w-full shrink-0 rounded-xl border border-[#1fb6e6]/40 bg-white/5 p-4 backdrop-blur-sm sm:p-5 lg:w-[22%]">
            <ul className="flex flex-col gap-3">
              {checklistItems.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#19c9ee]/15">
                    <Icon size={16} className="text-[#19d5f2]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-white">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
      </main>

      <Footer />
    </div>
  );
}