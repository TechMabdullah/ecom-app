"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  console.log("All params received:", Object.fromEntries(searchParams.entries()));
  console.log("OOB Code:", oobCode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Reset code verification failed:", err.code, err.message);
        setStatus("invalid");
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await confirmPasswordReset(auth, oobCode!, password);
      setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace("Firebase: ", ""));
      }
    }
  };

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm opacity-50">checking link...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl mb-2">Link expired or invalid</h1>
          <p className="opacity-60 mb-6">Password reset links expire after 1 hour.</p>
          <a href="/reset-password" className="font-mono text-sm underline">
            request a new link
          </a>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl mb-2">Password updated</h1>
          <p className="opacity-60 mb-6">You can now log in with your new password.</p>
          <button
            onClick={() => router.push("/login")}
            className="font-mono text-sm px-6 py-3 rounded-sm"
            style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
          >
            go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl mb-2">Set a new password</h1>
        <p className="opacity-60 text-sm mb-6">for {email}</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            minLength={6}
            className="w-full border rounded-sm px-3 py-2 bg-transparent font-mono text-sm"
            style={{ borderColor: "var(--trace)" }}
          />
          <button
            type="submit"
            className="w-full font-mono text-sm px-6 py-3 rounded-sm"
            style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
          >
            update password
          </button>
        </form>
      </div>
    </div>
  );
}