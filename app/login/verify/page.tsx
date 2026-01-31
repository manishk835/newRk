// app/login/verify/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const redirect = searchParams.get("redirect");
    const phone = searchParams.get("phone") || "";
    const name = searchParams.get("name") || "";
    
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
    
      if (otp.length !== 6) {
        setError("Enter 6-digit OTP");
        return;
      }
    
      setLoading(true);
    
      setTimeout(() => {
        if (otp !== "123456") {
          setError("Invalid OTP");
          setLoading(false);
          return;
        }
    
        // ✅ SAVE LOGIN
        localStorage.setItem(
          "rk_user",
          JSON.stringify({ name, phone })
        );
    
        // ✅ COOKIE FOR MIDDLEWARE
        document.cookie = "rk_user=1; path=/; max-age=604800";
    
        // ✅ REDIRECT BACK OR HOME
        window.location.href = redirect || "/";
      }, 800);
    };
    

  return (
    <main className="pt-24">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto border rounded-2xl p-8 shadow-sm bg-white">

          {/* BRAND */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold">
              RK<span className="text-[#F5A623]">Fashion</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Verify OTP sent to
            </p>
            <p className="font-medium mt-1">
              +91 {phone}
            </p>
          </div>

          {/* OTP FORM */}
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full text-center tracking-widest text-lg border px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#F5A623] outline-none"
            />

            {error && (
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          {/* HELP */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive OTP?
            </p>
            <button className="text-sm font-medium underline">
              Resend OTP
            </button>

            <p className="text-xs text-gray-500 mt-4">
              <Link href="/login" className="underline">
                Change number
              </Link>
            </p>
          </div>

          {/* NOTE */}
          <p className="text-[11px] text-gray-400 text-center mt-6">
            Demo OTP: <b>123456</b>
          </p>
        </div>
      </div>
    </main>
  );
}
