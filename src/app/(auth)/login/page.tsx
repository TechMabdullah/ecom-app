"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth";
import { loginWithEmail, loginWithGoogle, loginWithFacebook } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message.replace("Firebase: ", ""));
    }
  };

  const handleFacebookLogin = async () => {
  setError("");
  try {
    await loginWithFacebook();
    router.push("/");
  } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message.replace("Firebase: ", ""));
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <a href="/reset-password" className="text-sm underline text-gray-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-gray-400">or</div>

        <button onClick={handleGoogleLogin} className="w-full border rounded-lg py-2">
        Continue with Google
        </button>

        <button onClick={handleFacebookLogin} className="w-full border rounded-lg py-2 mt-2">
        Continue with Facebook
        </button>

        <a
          href="/magic-link"
          className="block w-full text-center border rounded-lg py-2 mt-2"
        >
          Sign in with magic link
        </a>

        <p className="mt-6 text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
         <a href="/signup" className="underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}