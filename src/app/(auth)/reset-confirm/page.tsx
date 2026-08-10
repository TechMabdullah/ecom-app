"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function ResetConfirmPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const oobCode = searchParams.get("oobCode");

  console.log(
    "All params received:",
    Object.fromEntries(searchParams.entries())
  );
  console.log("OOB Code:", oobCode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<
    "checking" | "ready" | "invalid" | "done"
  >(oobCode ? "checking" : "invalid");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!oobCode) {
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch((err) => {
        console.error(
          "Reset code verification failed:",
          err.code,
          err.message
        );

        setStatus("invalid");
      });
  }, [oobCode]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!oobCode) {
      setError("Password reset link is invalid or missing.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace("Firebase: ", ""));
      } else {
        setError("Unable to update password.");
      }
    }
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="font-mono text-sm">
          checking link...
        </p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-mono text-xl mb-4">
            Link expired or invalid
          </h1>

          <p className="font-mono text-sm mb-6">
            Password reset links expire after 1 hour.
          </p>

          <button
            type="button"
            onClick={() => router.push("/reset-password")}
            className="font-mono text-sm px-6 py-3 rounded-sm"
            style={{
              backgroundColor: "var(--amber)",
              color: "var(--graphite)",
            }}
          >
            request a new link
          </button>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-mono text-xl mb-4">
            Password updated
          </h1>

          <p className="font-mono text-sm mb-6">
            You can now log in with your new password.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-mono text-sm px-6 py-3 rounded-sm"
            style={{
              backgroundColor: "var(--amber)",
              color: "var(--graphite)",
            }}
          >
            go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-mono text-xl mb-2">
          Set a new password
        </h1>

        <p className="font-mono text-sm mb-6">
          for {email}
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

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
            style={{
              backgroundColor: "var(--amber)",
              color: "var(--graphite)",
            }}
          >
            update password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <p className="font-mono text-sm">
            checking link...
          </p>
        </div>
      }
    >
      <ResetConfirmPageContent />
    </Suspense>
  );
}