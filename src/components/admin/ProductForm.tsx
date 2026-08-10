"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";

interface Props {
  initial?: Partial<Product>;
  isEdit?: boolean;
}

export default function ProductForm({ initial, isEdit }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    price: initial?.price ? (initial.price / 100).toString() : "",
    category: initial?.category || "",
    stock: initial?.stock?.toString() || "",
    images: initial?.images?.join("\n") || "",
    featured: initial?.featured || false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await user!.getIdToken();
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Math.round(parseFloat(form.price) * 100),
        category: form.category,
        stock: parseInt(form.stock, 10),
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        featured: form.featured,
      };

      const url = isEdit ? `/api/admin/products/${initial?.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm";
  const borderStyle = { borderColor: "var(--trace)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div>
        <label className="font-mono text-xs opacity-60 block mb-1">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={inputStyle}
          style={borderStyle}
        />
      </div>

      <div>
        <label className="font-mono text-xs opacity-60 block mb-1">
          Slug (URL-friendly, unique — e.g. esp32-devkit-v2)
        </label>
        <input
          required
          disabled={isEdit}
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          className={inputStyle}
          style={{ ...borderStyle, opacity: isEdit ? 0.5 : 1 }}
        />
      </div>

      <div>
        <label className="font-mono text-xs opacity-60 block mb-1">Description</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={inputStyle}
          style={borderStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs opacity-60 block mb-1">Price (USD)</label>
          <input
            required
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className={inputStyle}
            style={borderStyle}
          />
        </div>
        <div>
          <label className="font-mono text-xs opacity-60 block mb-1">Stock</label>
          <input
            required
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className={inputStyle}
            style={borderStyle}
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs opacity-60 block mb-1">Category</label>
        <input
          required
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className={inputStyle}
          style={borderStyle}
        />
      </div>

      <div>
        <label className="font-mono text-xs opacity-60 block mb-1">
          Image URLs (one per line, first is the main image)
        </label>
        <textarea
          required
          rows={3}
          value={form.images}
          onChange={(e) => handleChange("images", e.target.value)}
          className={inputStyle}
          style={borderStyle}
        />
      </div>

      <label className="flex items-center gap-2 font-mono text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => handleChange("featured", e.target.checked)}
        />
        Featured on homepage
      </label>

      <button
        type="submit"
        disabled={loading}
        className="font-mono text-sm px-6 py-3 rounded-sm disabled:opacity-50"
        style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
      >
        {loading ? "saving..." : isEdit ? "update product" : "create product"}
      </button>
    </form>
  );
}