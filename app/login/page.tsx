// app/login//page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useSearchParams } from "next/navigation";



export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    // ✅ Dummy login (real ecommerce flow starter)
    // submit ke andar
    setTimeout(() => {
        router.push(
            `/login/verify?phone=${phone}&name=${encodeURIComponent(
              name
            )}&redirect=${redirect || ""}`
          );
          
    }, 800);
    
  };

  return (
    <main className="pt-24">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto border rounded-2xl p-8 shadow-sm bg-white">

          {/* BRAND */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#111111]">
              RK<span className="text-[#F5A623]">Fashion</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Login to continue shopping
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#F5A623] outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#F5A623] outline-none"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          {/* TERMS */}
          <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
            By continuing, you agree to RK Fashion House&apos;s{" "}
            <Link href="#" className="underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* HELP */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Need help? Contact support.
          </p>
        </div>
      </div>
    </main>
  );
}
