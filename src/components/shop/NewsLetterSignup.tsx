"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };


  if (status === "success") {
    return (
      <p className="font-mono text-sm" style={{ color: "var(--amber)" }}>
        ✓ you&apos;re on the list
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
        style={{ borderColor: "var(--trace)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-sm px-4 py-2 rounded-sm shrink-0 disabled:opacity-50"
        style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
      >
        {status === "loading" ? "..." : "subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 absolute mt-12">{error}</p>
      )}
    </form>
  );
}