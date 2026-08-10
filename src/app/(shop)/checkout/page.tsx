"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import CheckoutForm from "@/components/shop/CheckoutForm";
import CodCheckoutForm from "@/components/shop/CodCheckoutForm";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const SHIPPING_CENTS = 599;

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [clientSecret, setClientSecret] = useState("");
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotals({ subtotal, shipping: SHIPPING_CENTS, total: subtotal + SHIPPING_CENTS });

    if (method === "card") {
      fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, userId: user?.uid }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setClientSecret(data.clientSecret);
        })
        .catch((err) => setError(err.message));
    }
  }, [mounted, items, user, router, method]);

  if (!mounted || items.length === 0) return null;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order:\n${items.map((i) => `${i.name} x${i.quantity}`).join("\n")}\n\nTotal: ${formatPrice(totals.total)}`
  );

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">Checkout</h1>

      <div
        className="component-card rounded-sm p-5 mb-8 space-y-2 font-mono text-sm"
        style={{ borderColor: "var(--trace)" }}
      >
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between opacity-70">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatPrice(item.priceAtAdd * item.quantity)}</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t space-y-1" style={{ borderColor: "var(--trace)" }}>
          <div className="flex justify-between opacity-70">
            <span>Subtotal</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between opacity-70">
            <span>Shipping</span>
            <span>{formatPrice(totals.shipping)}</span>
          </div>
          <div className="flex justify-between text-base" style={{ color: "var(--amber)" }}>
            <span>Total</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-6">
        {(["card", "cod"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className="font-mono text-xs px-4 py-2 rounded-sm border"
            style={{
              borderColor: method === m ? "var(--amber)" : "var(--trace)",
              color: method === m ? "var(--amber)" : "inherit",
              opacity: method === m ? 1 : 0.6,
            }}
          >
            {m === "card" ? "pay by card" : "cash on delivery"}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {method === "card" && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} totals={totals} userId={user?.uid} />
        </Elements>
      )}

      {method === "cod" && (
        <CodCheckoutForm totals={totals} userId={user?.uid} />
      )}

      <a
        href={`https://wa.me/923357875909?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 font-mono text-sm px-6 py-3 rounded-sm border"
        style={{ borderColor: "#25D366", color: "#25D366" }}
      >
        order on WhatsApp instead
      </a>
    </main>
  );
}