"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import Pagination from "../components/Pagination";

type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  categoryId: number;
  price: number;
  originalPrice: number;
  image: string;
  videoUrl?: string | null;
  description: string;
  colors: string;
  storageOptions: string;
  quickSpecs: string;
  keyFeatures: string;
  inStock: boolean;
  stockQuantity: number;
  images?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isDeal: boolean;
  category?: { name: string };
};
type FormState = {
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  image: string;
  videoUrl: string;
  description: string;
  colors: string;
  storageOptions: string;
  quickSpecs: string;
  keyFeatures: string;
  inStock: boolean;
  stockQuantity: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isDeal: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  brand: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  image: "",
  videoUrl: "",
  description: "",
  colors: "",
  storageOptions: "",
  quickSpecs: "",
  keyFeatures: "",
  inStock: true,
  stockQuantity: "0",
  isFeatured: false,
  isNewArrival: false,
  isDeal: false,
};
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const STEPS = [
  { id: 1, label: "Basic info" },
  { id: 2, label: "Details & media" },
] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const selectedCategory = categories.find((category) => String(category.id) === form.categoryId);
  const showTechFields = ["electronics", "style gadgets"].includes(selectedCategory?.name.toLowerCase() ?? "");

  async function fetchData() {
    const [productResponse, categoryResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);
    return {
      products: productResponse.ok ? ((await productResponse.json()) as Product[]) : [],
      categories: categoryResponse.ok ? ((await categoryResponse.json()) as Category[]) : [],
    };
  }
  async function loadData() {
    const result = await fetchData();
    setProducts(result.products);
    setCategories(result.categories);
    setLoading(false);
  }
  useEffect(() => {
    let mounted = true;
    void fetchData().then((result) => {
      if (mounted) {
        setProducts(result.products);
        setCategories(result.categories);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugEdited(false);
    setImageFiles([]);
    setVideoFile(null);
    setImagePreviews([]);
    setMessage("");
    setStep(1);
    setShowForm(true);
  }
  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      categoryId: String(product.categoryId),
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      image: product.image,
      videoUrl: product.videoUrl ?? "",
      description: product.description ?? "",
      colors: product.colors ? JSON.parse(product.colors).join(", ") : "",
      storageOptions: product.storageOptions ? JSON.parse(product.storageOptions).join(", ") : "",
      quickSpecs: product.quickSpecs ? JSON.parse(product.quickSpecs).join(", ") : "",
      keyFeatures: product.keyFeatures ? JSON.parse(product.keyFeatures).join(", ") : "",
      inStock: product.inStock,
      stockQuantity: String(product.stockQuantity ?? 0),
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isDeal: product.isDeal,
    });
    setSlugEdited(true);
    setImageFiles([]);
    setVideoFile(null);
    setImagePreviews(product.images ? JSON.parse(product.images) : [product.image]);
    setMessage("");
    setStep(1);
    setShowForm(true);
  }
  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateStep1(): boolean {
    if (!form.name.trim() || !form.slug.trim() || !form.brand.trim() || !form.categoryId || !form.originalPrice) {
      setMessage("Please fill in all required fields before continuing.");
      return false;
    }
    setMessage("");
    return true;
  }
  function goToStep2() {
    if (validateStep1()) setStep(2);
  }
  function goToStep1() {
    setMessage("");
    setStep(1);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 2) {
      goToStep2();
      return;
    }
    if (saving) return;
    setSaving(true);
    setMessage("");
    let image = form.image;
    const uploadedImages: string[] = [];
    for (const file of imageFiles.slice(0, 4)) {
      const data = new FormData();
      data.append("file", file);
      const upload = await fetch("/api/uploads", { method: "POST", body: data });
      const result = (await upload.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!upload.ok || !result.url) { setMessage(result.message ?? "Unable to upload image."); setSaving(false); return; }
      uploadedImages.push(result.url);
    }
    if (uploadedImages.length) image = uploadedImages[0];
    let videoUrl = form.videoUrl.trim();
    if (videoFile) {
      const data = new FormData();
      data.append("file", videoFile);
      const upload = await fetch("/api/uploads", { method: "POST", body: data });
      const result = (await upload.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!upload.ok || !result.url) { setMessage(result.message ?? "Unable to upload video."); setSaving(false); return; }
      videoUrl = result.url;
    }
    const payload = {
      ...form,
      image,
      images: uploadedImages.length ? uploadedImages : (form.image ? [form.image] : []),
      videoUrl,
      colors: form.colors.split(",").map((value) => value.trim()).filter(Boolean),
      storageOptions: form.storageOptions.split(",").map((value) => value.trim()).filter(Boolean),
      quickSpecs: form.quickSpecs.split(",").map((value) => value.trim()).filter(Boolean),
      keyFeatures: form.keyFeatures.split(",").map((value) => value.trim()).filter(Boolean),
      categoryId: Number(form.categoryId),
      price: Number(form.price || form.originalPrice),
      originalPrice: Number(form.originalPrice),
      stockQuantity: Number(form.stockQuantity || 0),
    };
    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const result = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    if (!response.ok) {
      setMessage(result.message ?? "Unable to save product.");
      setSaving(false);
      return;
    }
    setShowForm(false);
    setImageFiles([]);
    await loadData();
    setSaving(false);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    const response = await fetch(`/api/products/${deleteTarget.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setDeleteTarget(null);
      await loadData();
    }
    setDeleting(false);
  }

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.brand} ${product.slug} ${product.category?.name ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[260px]">
        <AdminSidebar
          activeNav="Products"
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={() => undefined}
        />
        <AdminHeader query={query} onQueryChange={(value) => { setQuery(value); setCurrentPage(1); }} searchPlaceholder="Search products..." onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/ruman-admin-hub"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]"
              >
                <ArrowLeft size={15} /> Dashboard
              </Link>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">
                Catalog management
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">
                Products
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage products and connect each one to a category.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#0b1d45] px-4 py-3 text-sm font-bold text-white hover:bg-[#102d62]"
            >
              <Plus size={17} /> Add product
            </button>
          </div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-[#0b1d45]">
                All products{" "}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  {products.length}
                </span>
              </h2>
            </div>
            {loading ? (
              <p className="p-8 text-center text-sm text-slate-500">
                Loading products...
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#0b1d45]">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.brand} ·{" "}
                          {product.category?.name ?? "Unassigned"}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#0b75a5]">
                          Rs. {product.price.toLocaleString("en-PK")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-[#1fb6e6] hover:text-[#0b75a5]"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        aria-label={`Delete ${product.name}`}
                        className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="p-10 text-center">
                    <ImagePlus className="mx-auto text-slate-300" size={30} />
                    <p className="mt-3 text-sm text-slate-500">
                      No products yet.
                    </p>
                  </div>
                )}
                <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </section>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#071b3d]/60 p-3 backdrop-blur-sm sm:p-4">
          <section className="my-4 max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 sm:my-6 sm:max-h-[calc(100vh-3rem)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-[#0b1d45] to-[#123a7a] px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Edit product" : "New product"}
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  {editingId ? "Update product details below." : "Fill in the details to add a new product."}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
                className="shrink-0 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
              {STEPS.map((s, index) => (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        step === s.id
                          ? "bg-[#1fb6e6] text-white"
                          : step > s.id
                            ? "bg-[#0b1d45] text-white"
                            : "bg-white text-slate-400 ring-1 ring-slate-200"
                      }`}
                    >
                      {step > s.id ? <Check size={14} /> : s.id}
                    </span>
                    <span
                      className={`hidden text-xs font-bold sm:inline ${
                        step >= s.id ? "text-[#0b1d45]" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        step > s.id ? "bg-[#0b1d45]" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={saveProduct} className="flex max-h-[calc(100vh-14rem)] flex-col overflow-y-auto">
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
                {step === 1 && (
                  <>
                    <label className="text-sm font-semibold text-slate-700">
                      Product name
                      <input
                        required
                        value={form.name}
                        onChange={(event) => {
                          const name = event.target.value;
                          setForm((current) => ({
                            ...current,
                            name,
                            slug: slugEdited ? current.slug : slugify(name),
                          }));
                        }}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Slug
                      <input
                        required
                        value={slugEdited ? form.slug : slugify(form.name)}
                        onChange={(event) => {
                          setSlugEdited(true);
                          updateField("slug", event.target.value);
                        }}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Brand
                      <input
                        required
                        value={form.brand}
                        onChange={(event) => updateField("brand", event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Category
                      <select
                        required
                        value={form.categoryId}
                        onChange={(event) => {
                          const categoryId = event.target.value;
                          const category = categories.find((item) => String(item.id) === categoryId);
                          const isTechCategory = ["electronics", "style gadgets"].includes(category?.name.toLowerCase() ?? "");
                          setForm((current) => ({ ...current, categoryId, ...(isTechCategory ? {} : { storageOptions: "", quickSpecs: "" }) }));
                        }}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {selectedCategory && <span className="mt-1 block text-xs font-normal text-[#0b75a5]">Fields updated for {selectedCategory.name}.</span>}
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Sale price{" "}
                      <span className="font-normal text-slate-400">(optional)</span>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) => updateField("price", event.target.value)}
                        placeholder="Leave blank for regular price"
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Original price
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.originalPrice}
                        onChange={(event) =>
                          updateField("originalPrice", event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Description
                      <textarea
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                        placeholder="Product description"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Stock quantity
                      <input
                        type="number"
                        min="0"
                        value={form.stockQuantity}
                        onChange={(event) => updateField("stockQuantity", event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                    </label>
                    <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-semibold text-slate-700">
                      <input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} className="h-4 w-4 accent-[#0b75a5]" /> In stock
                    </label>
                    <div className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2 sm:grid-cols-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} className="h-4 w-4 accent-[#0b75a5]" /> Featured</label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isNewArrival} onChange={(event) => setForm({ ...form, isNewArrival: event.target.checked })} className="h-4 w-4 accent-[#0b75a5]" /> New arrival</label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isDeal} onChange={(event) => setForm({ ...form, isDeal: event.target.checked })} className="h-4 w-4 accent-[#0b75a5]" /> Deal</label>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Colors <span className="font-normal text-slate-400">comma separated</span>
                      <input value={form.colors} onChange={(event) => updateField("colors", event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20" placeholder="Black, Silver" />
                    </label>
                    {showTechFields && (
                      <label className="text-sm font-semibold text-slate-700">
                        Storage options <span className="font-normal text-slate-400">comma separated</span>
                        <input value={form.storageOptions} onChange={(event) => updateField("storageOptions", event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20" placeholder="256GB, 512GB" />
                      </label>
                    )}
                    {showTechFields && (
                      <label className={`text-sm font-semibold text-slate-700 ${showTechFields ? "" : "sm:col-span-2"}`}>
                        Quick specs <span className="font-normal text-slate-400">comma separated</span>
                        <textarea value={form.quickSpecs} onChange={(event) => updateField("quickSpecs", event.target.value)} className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20" placeholder="15.6 inch display, 8GB RAM" />
                      </label>
                    )}
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Key features <span className="font-normal text-slate-400">comma separated</span>
                      <textarea value={form.keyFeatures} onChange={(event) => updateField("keyFeatures", event.target.value)} className="mt-2 min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20" placeholder="Fast processor, Lightweight design" />
                    </label>
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Product images <span className="font-normal text-slate-400">(optional, up to 4)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? []).slice(0, 4);
                          setImageFiles(files);
                          setImagePreviews(files.map((file) => URL.createObjectURL(file)));
                        }}
                        className="mt-2 block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-normal text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-[#e6f7fc] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#0b75a5]"
                      />
                      {imagePreviews.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {imagePreviews.map((preview, index) => (
                            <img key={preview} src={preview} alt={`Product preview ${index + 1}`} className="h-20 w-24 rounded-lg border border-slate-200 object-contain" />
                          ))}
                        </div>
                      )}
                    </label>
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Product video <span className="font-normal text-slate-400">(optional)</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                        className="mt-2 block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-normal text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-[#e6f7fc] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#0b75a5]"
                      />
                      <input
                        type="url"
                        value={form.videoUrl}
                        onChange={(event) => updateField("videoUrl", event.target.value)}
                        placeholder="Or paste a direct MP4/WebM video URL"
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition-colors focus:border-[#1fb6e6] focus:ring-2 focus:ring-[#1fb6e6]/20"
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-400">Upload MP4/WebM up to 50MB, or paste a direct video URL.</span>
                      {form.videoUrl && !videoFile && <span className="mt-1 block truncate text-xs font-normal text-emerald-600">Existing video saved</span>}
                    </label>
                  </>
                )}

                {message && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 sm:col-span-2">{message}</p>
                )}
              </div>

              {/* Footer / navigation */}
              <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
                <button
                  type="button"
                  formNoValidate
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (step === 1) setShowForm(false);
                    else goToStep1();
                  }}
                  className="h-11 min-w-24 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                {step === 1 ? (
                  <button
                    type="button"
                    formNoValidate
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      goToStep2();
                    }}
                    className="flex h-11 min-w-36 items-center justify-center gap-1.5 rounded-lg bg-[#0b1d45] px-5 text-sm font-bold text-white transition-colors hover:bg-[#102d62]"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex h-11 min-w-36 items-center justify-center rounded-lg bg-[#1fb6e6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0b9dcc] disabled:cursor-wait disabled:opacity-70"
                    disabled={saving}
                  >
                    {saving ? <><Loader2 size={15} className="mr-2 inline animate-spin" />Saving...</> : editingId ? "Save changes" : "Create product"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071b3d]/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Trash2 size={19} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#0b1d45]">
              Delete product?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This will remove{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.name}
              </span>{" "}
              and its stored image.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {deleting ? <><Loader2 size={15} className="mr-2 inline animate-spin" />Deleting...</> : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}