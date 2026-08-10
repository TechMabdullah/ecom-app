"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

export default function ProductsBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="search parts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
          style={{ borderColor: "var(--trace)" }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setCategory(null)}
          className="font-mono text-xs px-3 py-1.5 rounded-sm border"
          style={{
            borderColor: !category ? "var(--amber)" : "var(--trace)",
            color: !category ? "var(--amber)" : "inherit",
            opacity: !category ? 1 : 0.6,
          }}
        >
          all
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="font-mono text-xs px-3 py-1.5 rounded-sm border"
            style={{
              borderColor: category === cat ? "var(--amber)" : "var(--trace)",
              color: category === cat ? "var(--amber)" : "inherit",
              opacity: category === cat ? 1 : 0.6,
            }}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm opacity-50">No parts match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product, i) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}