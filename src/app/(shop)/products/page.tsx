import { getAllProducts } from "@/lib/products";
import ProductsBrowser from "@/components/shop/ProductsBrowser";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <div className="mb-10 animate-fade-up">
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--amber)" }}>
          Full catalog
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold">All parts</h1>
      </div>

      <ProductsBrowser products={products} />
    </main>
  );
}