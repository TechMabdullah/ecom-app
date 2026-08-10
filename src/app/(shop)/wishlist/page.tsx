"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductBySlugClient } from "@/lib/products-client";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    Promise.all(productIds.map((id) => getProductBySlugClient(id))).then((results) => {
      setProducts(results.filter((p): p is Product => p !== null));
    });
  }, [mounted, productIds]);

  if (!mounted) return null;

  if (products.length === 0) {
    return (
      <main className="px-6 md:px-12 pt-24 pb-24 max-w-3xl mx-auto text-center">
        <h1 className="font-display text-3xl mb-4">Your wishlist is empty</h1>
        <Link
          href="/products"
          className="font-mono text-sm px-6 py-3 rounded-sm border inline-block"
          style={{ borderColor: "var(--amber)", color: "var(--amber)" }}
        >
          browse parts
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">Your wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}