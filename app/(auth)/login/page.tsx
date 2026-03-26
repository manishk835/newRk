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

  /* ================= REDIRECT ================= */
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [user, loading, router, redirect]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      return setError("Enter phone or email");
    }

    if (!password) {
      return setError("Enter password");
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            identifier: identifier.trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ IMPORTANT
      await refreshUser();

      router.replace(redirect);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">

      {/* LOGO */}
      <div className="mt-6 mb-4 text-xl font-semibold">
        RKFashion
      </div>

      {/* CARD */}
      <div className="w-full max-w-xs border rounded-lg p-6">

        <h1 className="text-lg font-medium mb-4">
          Sign in
        </h1>

        <form onSubmit={handleLogin}>

          {/* IDENTIFIER */}
          <label className="text-sm font-medium">
            Mobile number or email
          </label>

          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full mt-1 mb-3 px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-yellow-500"
          />

          {/* PASSWORD */}
          <label className="text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-3 px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-yellow-500"
          />

          {/* ERROR */}
          {error && (
            <p className="text-xs text-red-500 mb-3">
              {error}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-yellow-300 py-1.5 rounded text-sm font-medium"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {/* FORGOT PASSWORD */}
        <div className="mt-3 text-xs">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* CREATE ACCOUNT */}
        <div className="mt-4 border-t pt-3">

          <p className="text-xs mb-2 text-gray-600">
            New to RKFashion?
          </p>

          <button
            onClick={() => router.push("/register")}
            className="w-full border py-1.5 rounded text-sm hover:bg-gray-50"
          >
            Create your account
          </button>

        </div>

      </div>

    </main>
  );
}