import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductReviews from "@/components/shop/ProductReviews";
import ProductGallery from "@/components/shop/ProductGallery";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="component-card relative rounded-sm overflow-hidden animate-fade-up">
          <div className="designator">
            {product.category.slice(0, 2).toUpperCase()}-{product.id.slice(0, 3)}
          </div>
          <ProductGallery images={product.images} name={product.name} category={product.category} id={product.id} />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <p className="font-mono text-xs uppercase tracking-wide opacity-50 mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            {product.name}
          </h1>
          <p className="font-mono text-2xl mb-6" style={{ color: "var(--amber)" }}>
            {formatPrice(product.price)}
          </p>
          <p className="opacity-70 leading-relaxed mb-8">{product.description}</p>

          <p className="font-mono text-xs opacity-50 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
      <ProductReviews reviews={product.reviews || []} productId={product.id} />
    </main>
  );
}