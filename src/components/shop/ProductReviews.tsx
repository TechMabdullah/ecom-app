"use client";

import { useState } from "react";
import { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "var(--amber)" }}>
      {"★".repeat(rating)}
      <span style={{ opacity: 0.3 }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ProductReviews({
  reviews,
  productId,
}: {
  reviews: Review[];
  productId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, body }),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t" style={{ borderColor: "var(--trace)" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl">
            Reviews {avgRating && <span className="font-mono text-base opacity-60">({avgRating} · {reviews.length})</span>}
          </h2>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="font-mono text-xs underline opacity-70 hover:opacity-100"
        >
          write a review
        </button>
      </div>

      {submitted && (
        <p className="text-sm mb-6" style={{ color: "var(--amber)" }}>
          ✓ Thanks — your review is posted.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="component-card rounded-sm p-5 mb-8 space-y-3 max-w-md">
          <input
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n} style={{ color: "black" }}>
                {n} stars
              </option>
            ))}
          </select>
          <textarea
            required
            rows={3}
            placeholder="How was it?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-sm px-4 py-2 rounded-sm disabled:opacity-50"
            style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
          >
            {loading ? "posting..." : "submit review"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm opacity-50">No reviews yet — be the first.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b" style={{ borderColor: "var(--trace)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Stars rating={review.rating} />
                <span className="font-mono text-xs opacity-50">{review.name}</span>
              </div>
              <p className="text-sm opacity-80">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}