"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/validations/auth";
import { signUpWithEmail, loginWithGoogle, loginWithFacebook } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: SignUpInput) => {
    setError("");
    setLoading(true);
    try {
      await signUpWithEmail(data.name, data.email, data.password);
      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setError(error.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setError(error.replace("Firebase: ", ""));
    }
  };

  const handleFacebookSignUp = async () => {
    setError("");
    try {
      await loginWithFacebook();
      router.push("/");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setError(error.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Create an account</h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-gray-400">or</div>

        <button onClick={handleGoogleSignUp} className="w-full border rounded-lg py-2">
        Continue with Google
        </button>

        <button onClick={handleFacebookSignUp} className="w-full border rounded-lg py-2 mt-2">
        Continue with Facebook
        </button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="underline">Log in</a>
        </p>
      </div>
    </div>
  );
}