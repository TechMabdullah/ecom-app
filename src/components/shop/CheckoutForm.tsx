"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/hooks/useCart";

interface Props {
  clientSecret: string;
  totals: { subtotal: number; shipping: number; total: number };
  userId?: string;
}

export default function CheckoutForm({ totals, userId }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          userId,
          items,
          shippingAddress: address,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          total: totals.total,
        }),
      });
      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        setError(data.error || "Order could not be saved");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-display text-lg mb-3">Shipping address</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Full name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="col-span-2 px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <input
            required
            placeholder="Address line 1"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="col-span-2 px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <input
            required
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <input
            required
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <input
            required
            placeholder="Postal code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            className="col-span-2 px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg mb-3">Payment</h2>
        <div className="component-card rounded-sm p-4">
          <PaymentElement />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full font-mono text-sm px-6 py-3 rounded-sm disabled:opacity-50"
        style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
      >
        {loading ? "processing..." : `pay ${(totals.total / 100).toFixed(2)}`}
      </button>
    </form>
  );
}