"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const DEALS = [
  { qty: 1, label: "1x", discount: 0 },
  { qty: 2, label: "2x", discount: 0.05 },
  { qty: 3, label: "3x", discount: 0.1 },
];

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  const handleClick = () => {
    for (let i = 0; i < selectedQty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div>
      <p className="font-mono text-xs opacity-50 mb-2">Quantity deal</p>
      <div className="flex gap-2 mb-4">
        {DEALS.map((deal) => {
          const unitPrice = Math.round(product.price * (1 - deal.discount));
          return (
            <button
              key={deal.qty}
              onClick={() => setSelectedQty(deal.qty)}
              className="flex-1 font-mono text-xs rounded-sm border py-2 px-2 text-center"
              style={{
                borderColor: selectedQty === deal.qty ? "var(--amber)" : "var(--trace)",
                color: selectedQty === deal.qty ? "var(--amber)" : "inherit",
                opacity: selectedQty === deal.qty ? 1 : 0.6,
              }}
            >
              <div>{deal.label}</div>
              {deal.discount > 0 && <div className="opacity-70">save {deal.discount * 100}%</div>}
              <div>{formatPrice(unitPrice)}/ea</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleClick}
        disabled={product.stock === 0}
        className="w-full font-mono text-sm px-6 py-3 rounded-sm border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          borderColor: "var(--amber)",
          color: added ? "var(--graphite)" : "var(--amber)",
          backgroundColor: added ? "var(--amber)" : "transparent",
        }}
      >
        {added ? "✓ added to cart" : `add ${selectedQty} to cart`}
      </button>
    </div>
  );
}