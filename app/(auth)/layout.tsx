// app/(auth)/layout.tsx

"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {

  const router =
    useRouter();

  const {
    user,
    loading,
  } = useAuth();

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (
      !loading &&
      user
    ) {

      router.replace(
        "/"
      );

    }

  }, [
    user,
    loading,
    router,
  ]);

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center transition-colors duration-300">

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl px-8 py-6 shadow-sm">

          <div className="flex flex-col items-center gap-4">

            {/* LOGO */}
            <h1 className="text-2xl font-bold text-black dark:text-white">
              RK
              <span className="text-[#F5A623]">
                Fashion
              </span>
            </h1>

            {/* LOADER */}
            <div className="w-10 h-10 border-3 border-gray-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Checking session...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center px-4 py-10 transition-colors duration-300">

      <div className="w-full max-w-md">

        {children}

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-8">
          © {new Date().getFullYear()} RK Fashion.
          All rights reserved.
        </p>

      </div>

    </main>
  );
}