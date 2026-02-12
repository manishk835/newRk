"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔁 If already logged in → redirect home
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border rounded-2xl p-8 text-center shadow-sm w-full max-w-md">

        <h2 className="text-2xl font-bold mb-2">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Create your RK Fashion account using your mobile number.
          Quick, secure and OTP-based.
        </p>

        <Link
          href="/login"
          className="inline-block w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Continue with Mobile
        </Link>

        {/* 🔮 Future ready area */}
        <div className="mt-6 text-xs text-gray-400">
          Social login options may be available soon.
        </div>

      </div>
    </main>
  );
}
