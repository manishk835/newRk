"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔁 If already logged in → redirect home
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-sm text-gray-500 animate-pulse">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          {children}
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          © {new Date().getFullYear()} RK Fashion. All rights reserved.
        </p>
      </div>
    </main>
  );
}
