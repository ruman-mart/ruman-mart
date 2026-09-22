"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
};

type FormState = { name: string; slug: string; image: string; description: string; isFeatured: boolean };

const emptyForm: FormState = { name: "", slug: "", image: "", description: "", isFeatured: false };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchCategories() {
    const response = await fetch("/api/categories");
    return response.ok ? ((await response.json()) as Category[]) : [];
  }

  useEffect(() => {
    let mounted = true;
    void fetchCategories().then((result) => {
      if (mounted) {
        setCategories(result);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugEdited(false);
    setImageFile(null);
    setImagePreview("");
    setMessage("");
    setShowForm(true);
  }

  function openEdit(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description ?? "",
      isFeatured: category.isFeatured,
    });
    setSlugEdited(true);
    setImageFile(null);
    setImagePreview(category.image);
    setMessage("");
    setShowForm(true);
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    let image = form.image;
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      const uploadResponse = await fetch("/api/uploads", { method: "POST", body: uploadData });
      const uploadResult = (await uploadResponse.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!uploadResponse.ok || !uploadResult.url) {
        setMessage(uploadResult.message ?? "Unable to upload image.");
        return;
      }
      image = uploadResult.url;
    }
    const endpoint = editingId
      ? `/api/categories/${editingId}`
      : "/api/categories";
    const response = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image }),
    });
    const result = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    if (!response.ok) {
      setMessage(result.message ?? "Unable to save category.");
      return;
    }
    setShowForm(false);
    setImageFile(null);
    setImagePreview("");
    setCategories(await fetchCategories());
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const response = await fetch(`/api/categories/${deleteTarget.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setDeleteTarget(null);
      setCategories(await fetchCategories());
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <div className="lg:pl-[248px]">
        <AdminSidebar
          activeNav="Categories"
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={() => undefined}
        />
        <AdminHeader
          query=""
          onQueryChange={() => undefined}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/admin"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0b75a5]"
              >
                <ArrowLeft size={15} /> Dashboard
              </Link>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b75a5]">
                Catalog management
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0b1d45]">
                Categories
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Create and manage the collections shown across your storefront.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#0b1d45] px-4 py-3 text-sm font-bold text-white hover:bg-[#102d62]"
            >
              <Plus size={17} /> Add category
            </button>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-bold text-[#0b1d45]">
                All categories{" "}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  {categories.length}
                </span>
              </h2>
            </div>
            {loading ? (
              <p className="p-8 text-center text-sm text-slate-500">
                Loading categories...
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#0b1d45]">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          /{category.slug}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <button
                        onClick={() => openEdit(category)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-[#1fb6e6] hover:text-[#0b75a5]"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(category)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="p-10 text-center">
                    <ImagePlus className="mx-auto text-slate-300" size={30} />
                    <p className="mt-3 text-sm text-slate-500">
                      No categories yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#071b3d]/50 p-4">
          <section className="my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0b1d45]">
                  {editingId ? "Edit category" : "New category"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  This information appears on the storefront.
                </p>
              </div>
              <button
                aria-label="Close form"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveCategory} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Name
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
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]"
                  placeholder="Electronics"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Slug
                <input
                  required
                  value={slugEdited ? form.slug : slugify(form.name)}
                  onChange={(event) => {
                    setSlugEdited(true);
                    setForm({ ...form, slug: event.target.value });
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#1fb6e6]"
                  placeholder="electronics"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Upload image
                <input
                  type="file"
                  required={!editingId && !form.image}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImageFile(file);
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                  className="mt-2 block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm font-normal text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-[#e6f7fc] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#0b75a5]"
                />
                <span className="mt-1 block text-xs font-normal text-slate-400">Max 5MB. JPG, PNG, WebP, or GIF.</span>
                {imagePreview && <img src={imagePreview} alt="Selected category preview" className="mt-3 h-24 w-36 rounded-lg border border-slate-200 object-cover" />}
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal outline-none focus:border-[#1fb6e6]"
                  placeholder="A short description"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 accent-[#0b75a5]"
                />
                Show this category on the landing page
              </label>
              {message && (
                <p className="text-sm text-rose-600 sm:col-span-2">{message}</p>
              )}
              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#1fb6e6] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b9dcc]"
                >
                  {editingId ? "Save changes" : "Create category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
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
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Trash2 size={19} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#0b1d45]">
              Delete category?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently remove{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.name}
              </span>{" "}
              from your categories.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void confirmDelete()}
                className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
