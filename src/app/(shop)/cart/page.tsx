"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="px-6 md:px-12 pt-24 pb-24 max-w-3xl mx-auto text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="opacity-60 mb-8">Add some parts to get started.</p>
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
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">Your cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="component-card flex gap-4 p-4 rounded-sm items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-sm shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base">{item.name}</h3>
              <p className="font-mono text-sm mt-1" style={{ color: "var(--amber)" }}>
                {formatPrice(item.priceAtAdd)}
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-sm">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 border rounded-sm"
                style={{ borderColor: "var(--trace)" }}
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-7 h-7 border rounded-sm"
                style={{ borderColor: "var(--trace)" }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="font-mono text-xs opacity-40 hover:opacity-80 ml-2"
            >
              remove
            </button>
          </div>
        ))}
      </div>

      <div
        className="mt-10 pt-6 border-t flex items-center justify-between"
        style={{ borderColor: "var(--trace)" }}
      >
        <span className="font-mono text-sm opacity-60">Total</span>
        <span className="font-display text-2xl" style={{ color: "var(--amber)" }}>
          {formatPrice(totalPrice())}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center font-mono text-sm px-6 py-3 rounded-sm"
        style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
      >
        proceed to checkout
      </Link>
    </main>
  );
}