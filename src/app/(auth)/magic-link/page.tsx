"use client";

import { useState } from "react";
// remove: import { sendMagicLink } from "@/lib/auth";

export default function MagicLinkPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      window.localStorage.setItem("emailForSignIn", email);
      setSent(true);
    } catch (err: unknown) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Sign in with a magic link</h1>
        <p className="text-sm text-gray-500 mb-6">
          No password needed — we&apos;ll email you a link to sign in instantly.
        </p>

        {sent ? (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">
            Check your inbox — click the link we sent to {email} to finish signing in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-gray-500">
          <a href="/login" className="underline">Back to login</a>
        </p>
      </div>
    </div>
  );
}