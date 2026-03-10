// app/(auth)/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, refreshUser } = useAuth();

  const redirectParam = searchParams.get("redirect") || "/";
  const redirect = redirectParam.startsWith("/") ? redirectParam : "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }

  }, [user, loading, router, redirect]);

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!identifier || !password) {
      setError("Please enter email and password");
      return;
    }

    try {

      setSubmitting(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        if (data.message?.toLowerCase().includes("verify")) {
          router.push(`/verify-otp?phone=${identifier}`);
          return;
        }

        throw new Error(data.message || "Login failed");

      }

      await refreshUser();

      router.replace(redirect);

    } catch (err: any) {

      setError(err.message || "Login failed");

    } finally {

      setSubmitting(false);

    }

  };

  if (loading) return null;

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold text-center mb-1">
          Sign in
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        {/* Google Login */}

        <button
          className="w-full border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          onClick={() =>
            window.location.href =
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
          }
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={submit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            value={identifier}
            disabled={submitting}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={submitting}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">
            {error}
          </p>
        )}

        <div className="text-sm text-center text-gray-500 mt-6">

          <button
            onClick={() => router.push("/forgot-password")}
            className="hover:underline"
          >
            Forgot password?
          </button>

        </div>

        <p className="text-sm text-gray-500 text-center mt-4">

          Don’t have an account?{" "}

          <button
            onClick={() => router.push("/register")}
            className="text-black font-medium hover:underline"
          >
            Sign up
          </button>

        </p>

      </div>

    </main>

  );

}
