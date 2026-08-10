import Link from "next/link";
import { Product } from "@/types";
import WishlistButton from "./WishlistButton";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block relative">
      <div className="component-card relative rounded-sm overflow-hidden">
        <div className="designator">{product.category.slice(0, 2).toUpperCase()}-{product.id.slice(0, 3)}</div>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base leading-snug">{product.name}</h3>
          <p className="text-xs opacity-50 mt-0.5 font-mono uppercase tracking-wide">{product.category}</p>
        </div>
        <span className="font-mono text-sm" style={{ color: "var(--amber)" }}>
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}