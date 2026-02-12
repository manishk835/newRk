"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect") || "/reset-password";

  // 🔐 prevent open redirect
  const redirect =
    redirectParam.startsWith("/") ? redirectParam : "/reset-password";

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // 🔁 Redirect to verify page
      router.push(
        `/verify?phone=${phone}&redirect=${encodeURIComponent(
          redirect
        )}`
      );

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

        <h2 className="text-xl font-bold text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mt-2 text-center">
          We will send an OTP to your registered mobile number
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">

          <input
            type="tel"
            placeholder="Mobile number"
            maxLength={10}
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Continue"}
          </button>

        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Make sure your number is active and accessible.
        </p>

      </div>
    </main>
  );
}
