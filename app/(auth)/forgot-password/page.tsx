"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPhone = searchParams.get("phone") || "";

  const [phone, setPhone] = useState(queryPhone);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= AUTO FILL ================= */

  useEffect(() => {
    if (queryPhone) {
      setPhone(queryPhone);
    }
  }, [queryPhone]);

  /* ================= VALIDATION ================= */

  const validate = () => {

    if (!phone) {
      setError("Enter mobile number");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }

    return true;
  };

  /* ================= SAFE FETCH ================= */

  const safeFetch = async (url: string, options: any, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return res;
    } catch {
      clearTimeout(id);
      throw new Error("Network error. Try again.");
    }
  };

  /* ================= SUBMIT ================= */

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validate()) return;

    try {

      setLoading(true);

      const res = await safeFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      // ✅ console OTP flow
      setSuccess("OTP sent (check backend console)");

      setTimeout(() => {
        router.push(`/reset-verify?phone=${phone}`);
      }, 1200);

    } catch (err: any) {

      setError(err.message || "Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        {/* CLOSE */}
        <button
          onClick={() => router.push("/login")}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-xl font-semibold text-center mb-2">
          Forgot password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered mobile number to receive a reset OTP
        </p>

        <form onSubmit={submit} className="space-y-5">

          {/* PHONE */}
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Mobile number"
            maxLength={10}
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            disabled={loading}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black"
          />

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="text-sm text-green-600 text-center">
              {success}
            </p>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>

        </form>

      </div>

    </main>

  );
}