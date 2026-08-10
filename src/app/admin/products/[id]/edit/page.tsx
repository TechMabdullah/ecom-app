"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlugClient } from "@/lib/products-client";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProductBySlugClient(id).then(setProduct);
  }, [id]);

  if (!product) return <main className="px-6 pt-24 text-center font-mono text-sm opacity-50">loading...</main>;

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-semibold mb-10">Edit product</h1>
      <ProductForm initial={product} isEdit />
    </main>
  );
}