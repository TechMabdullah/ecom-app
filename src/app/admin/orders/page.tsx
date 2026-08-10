"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Order, OrderStatus } from "@/types";

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

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "#8a8a8a",
  paid: "#c17817",
  shipped: "#4a7ab5",
  delivered: "#4a9a5a",
  cancelled: "#c14a4a",
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoading || !isAdmin) {
      if (!authLoading) setLoading(false);
      return;
    }
    async function load() {
      const token = await user!.getIdToken();
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
      setLoading(false);
    }
    load();
  }, [user, authLoading, isAdmin]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const token = await user!.getIdToken();
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } else {
      setError("Failed to update status");
    }
  };

  if (authLoading || loading) {
    return <main className="px-6 pt-24 text-center font-mono text-sm opacity-50">loading...</main>;
  }

  if (!isAdmin) {
    return (
      <main className="px-6 pt-24 text-center">
        <h1 className="font-display text-2xl">Not authorized</h1>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">Admin — Orders</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="component-card rounded-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs opacity-50">#{order.id.slice(0, 8)}</p>
                <p className="font-mono text-xs opacity-50">{formatDate(order.createdAt)}</p>
                <p className="text-sm mt-1">{order.shippingAddress?.fullName}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                className="font-mono text-xs px-2 py-1 rounded-sm border bg-transparent"
                style={{ borderColor: statusColors[order.status], color: statusColors[order.status] }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} style={{ color: "black" }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 mb-3 font-mono text-xs opacity-70">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
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