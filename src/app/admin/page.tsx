"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";


function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoading || !isAdmin) {
      if (!authLoading) setLoading(false);
      return;
    }

    async function load() {
      const token = await user!.getIdToken();
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.products) setProducts(data.products);
      setLoading(false);
    }
    load();
  }, [user, authLoading, isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const token = await user!.getIdToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      setError("Failed to delete");
    }
  };

  if (authLoading || loading) {
    return (
      <main className="px-6 md:px-12 pt-24 text-center">
        <p className="font-mono text-sm opacity-50">loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="px-6 md:px-12 pt-24 text-center">
        <h1 className="font-display text-2xl mb-2">Not authorized</h1>
        <p className="opacity-60">This area is restricted.</p>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
  <h1 className="font-display text-3xl md:text-4xl font-semibold">Admin — Products</h1>
  <Link
    href="/admin/products/new"
    className="font-mono text-sm px-4 py-2 rounded-sm"
    style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
  >
    + add product
  </Link>
</div>

<div className="flex gap-4 mb-8 font-mono text-xs">
  <a href="/admin" className="underline">products</a>
  <a href="/admin/orders" className="opacity-60 hover:opacity-100">orders</a>
</div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="component-card rounded-sm p-4 flex items-center gap-4"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display">{product.name}</p>
              <p className="font-mono text-xs opacity-50">
                {product.category} · stock: {product.stock}
              </p>
            </div>
            <span className="font-mono text-sm" style={{ color: "var(--amber)" }}>
              {formatPrice(product.price)}
            </span>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="font-mono text-xs underline opacity-70 hover:opacity-100"
            >
              edit
            </Link>
            <button
              onClick={() => handleDelete(product.id)}
              className="font-mono text-xs text-red-400 hover:opacity-80"
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}