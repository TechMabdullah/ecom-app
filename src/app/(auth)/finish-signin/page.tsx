"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isMagicLink, completeMagicLinkSignIn } from "@/lib/auth";

export default function FinishSignInPage() {
  const router = useRouter();
  const [needsEmail, setNeedsEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  let cancelled = false;

  async function run() {
    const url = window.location.href;

    if (!isMagicLink(url)) {
      if (!cancelled) setError("This link is invalid or has expired.");
      return;
    }

    const savedEmail = window.localStorage.getItem("emailForSignIn");
    if (!savedEmail) {
      if (!cancelled) setNeedsEmail(true);
      return;
    }

    try {
      await completeMagicLinkSignIn(url);
      if (!cancelled) router.push("/");
    } catch (err) {
      if (!cancelled) setError((err as Error).message.replace("Firebase: ", ""));
    }
  }

  run();

  return () => {
    cancelled = true;
  };
}, [router]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await completeMagicLinkSignIn(window.location.href, email);
      router.push("/");
    } catch (err) {
      setError((err as Error).message.replace("Firebase: ", ""));
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (needsEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-4">
          <p className="text-sm text-gray-500">
            Confirm your email to finish signing in:
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
          <button type="submit" className="w-full bg-black text-white rounded-lg py-2">
            Confirm
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}