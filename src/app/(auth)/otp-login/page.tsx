"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithToken } from "@/lib/auth";

export default function OtpLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await signInWithToken(data.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Sign in with a code</h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-sm text-gray-500">
              We&apos;ll email you a 6-digit code to sign in.
            </p>
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
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter the 6-digit code we sent to {email}
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              className="w-full border rounded-lg px-3 py-2 text-center text-lg tracking-widest"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & sign in"}
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