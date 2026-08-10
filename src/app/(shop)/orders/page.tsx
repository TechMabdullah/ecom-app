"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const statusColors: Record<string, string> = {
  pending: "#8a8a8a",
  paid: "#f0a93b",
  shipped: "#5b9fd6",
  delivered: "#6fbf73",
  cancelled: "#e05c5c",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user!.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
      setOrders(results);
      setLoading(false);
    }

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="px-6 md:px-12 pt-24 pb-24 max-w-3xl mx-auto text-center">
        <p className="font-mono text-sm opacity-50">loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="px-6 md:px-12 pt-24 pb-24 max-w-3xl mx-auto text-center">
        <h1 className="font-display text-3xl mb-4">Sign in to view your orders</h1>
        <Link
          href="/login"
          className="font-mono text-sm px-6 py-3 rounded-sm border inline-block"
          style={{ borderColor: "var(--amber)", color: "var(--amber)" }}
        >
          log in
        </Link>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="px-6 md:px-12 pt-24 pb-24 max-w-3xl mx-auto text-center">
        <h1 className="font-display text-3xl mb-4">No orders yet</h1>
        <p className="opacity-60 mb-8">Your past orders will show up here.</p>
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
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">Your orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="component-card rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-xs opacity-50">#{order.id.slice(0, 8)}</p>
                <p className="font-mono text-xs opacity-50 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <span
                className="font-mono text-xs px-2 py-1 rounded-sm uppercase"
                style={{
                  color: statusColors[order.status],
                  border: `1px solid ${statusColors[order.status]}`,
                }}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm opacity-70">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div
              className="flex justify-between pt-3 border-t font-mono text-sm"
              style={{ borderColor: "var(--trace)" }}
            >
              <span className="opacity-60">Total</span>
              <span style={{ color: "var(--amber)" }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}