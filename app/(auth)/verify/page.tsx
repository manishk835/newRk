"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const phoneParam = searchParams.get("phone") || "";
  const redirectParam = searchParams.get("redirect") || "/";

  // 🔐 Prevent open redirect attack
  const redirect =
    redirectParam.startsWith("/") ? redirectParam : "/";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Prevent direct access
  useEffect(() => {
    if (!phoneParam) {
      router.replace("/login");
    }
  }, [phoneParam, router]);

  const validate = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6 digit OTP");
      return false;
    }
    return true;
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phone: phoneParam,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // 🔄 Refresh auth context after login
      await refreshUser();

      // 🔁 Redirect to original page
      router.replace(redirect);

    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

        <h2 className="text-xl font-bold text-center mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit code sent to {phoneParam}
        </p>

        <form onSubmit={verify} className="space-y-4">

          <input
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            className="w-full text-center border px-4 py-3 rounded-lg tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter OTP"
          />

          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

        </form>

        {/* Future ready resend option */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Didn’t receive the code? You can request a new OTP in a few seconds.
        </p>

      </div>
    </main>
  );
}
