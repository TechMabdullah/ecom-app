"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-lg mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">Contact us</h1>
      <p className="opacity-60 text-sm mb-10">
        Question about a part, an order, or anything else — we read every message.
      </p>

      {status === "sent" ? (
        <p className="text-sm" style={{ color: "var(--amber)" }}>
          ✓ Message sent — we&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-3 py-2 rounded-sm bg-transparent border font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          {status === "error" && (
            <p className="text-red-500 text-sm">Something went wrong — try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="font-mono text-sm px-6 py-3 rounded-sm disabled:opacity-50"
            style={{ backgroundColor: "var(--amber)", color: "var(--pcb)" }}
          >
            {status === "loading" ? "sending..." : "send message"}
          </button>
        </form>
      )}
    </main>
  );
}