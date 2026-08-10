"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface Props {
  totals: { subtotal: number; shipping: number; total: number };
  userId?: string;
}

export default function CodCheckoutForm({ totals, userId }: Props) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "PK",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders/create-cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items,
          shippingAddress: address,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          total: totals.total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm";
  const borderStyle = { borderColor: "var(--trace)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="font-display text-lg mb-3">Shipping address</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Full name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className={`col-span-2 ${inputStyle}`}
            style={borderStyle}
          />
          <input
            required
            placeholder="Address line 1"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className={`col-span-2 ${inputStyle}`}
            style={borderStyle}
          />
          <input
            required
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className={inputStyle}
            style={borderStyle}
          />
          <input
            required
            placeholder="State/Province"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className={inputStyle}
            style={borderStyle}
          />
          <input
            required
            placeholder="Postal code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            className={`col-span-2 ${inputStyle}`}
            style={borderStyle}
          />
        </div>
      </div>

      <p className="text-xs opacity-50 font-mono">
        Pay {`$${(totals.total / 100).toFixed(2)}`} in cash when your order arrives. Please have exact change ready.
      </p>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-mono text-sm px-6 py-3 rounded-sm disabled:opacity-50"
        style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
      >
        {loading ? "placing order..." : "place order — pay on delivery"}
      </button>
    </form>
  );
}