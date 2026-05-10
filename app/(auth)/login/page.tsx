// app/(auth)/login/page.tsx

"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  const redirectParam =
    searchParams.get(
      "redirect"
    ) || "/";

  const redirect =
    redirectParam.startsWith(
      "/"
    )
      ? redirectParam
      : "/";

  const [
    identifier,
    setIdentifier,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (
      !loading &&
      user
    ) {

      router.replace(
        redirect
      );

    }

  }, [
    user,
    loading,
    router,
    redirect,
  ]);

  /* ================= LOGIN ================= */

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      if (
        !identifier.trim()
      ) {
        return setError(
          "Enter phone or email"
        );
      }

      if (!password) {
        return setError(
          "Enter password"
        );
      }

      try {

        setSubmitting(
          true
        );

        const res =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body: JSON.stringify(
                {
                  identifier:
                    identifier.trim(),

                  password,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (
          !res.ok
        ) {

          throw new Error(
            data.message ||
              "Login failed"
          );

        }

        /* REFRESH USER */
        await refreshUser();

        router.replace(
          redirect
        );

      } catch (
        err: any
      ) {

        setError(
          err.message ||
            "Something went wrong"
        );

      } finally {

        setSubmitting(
          false
        );

      }
    };

  /* ================= LOADING ================= */

  if (loading)
    return null;

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">

      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm p-8 transition-colors duration-300">

        {/* LOGO */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-black dark:text-white">
            RK
            <span className="text-[#F5A623]">
              Fashion
            </span>
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Welcome back
          </p>

        </div>

        {/* TITLE */}
        <div className="mb-6">

          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Sign In
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access your account securely
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleLogin
          }
          className="space-y-5"
        >

          {/* ERROR */}
          {error && (

            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>

          )}

          {/* EMAIL / PHONE */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Mobile number or email
            </label>

            <input
              type="text"
              value={
                identifier
              }
              onChange={(e) =>
                setIdentifier(
                  e.target.value
                )
              }
              placeholder="Enter phone or email"
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
            />

          </div>

          {/* PASSWORD */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Password
            </label>

            <input
              type="password"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter password"
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
            />

          </div>

          {/* FORGOT */}
          <div className="flex justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/forgot-password?phone=${identifier}`
                )
              }
              className="text-sm text-[#F5A623] hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              submitting
            }
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >

            {submitting
              ? "Signing in..."
              : "Sign In"}

          </button>

        </form>

        {/* REGISTER */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            New to RKFashion?
          </p>

          <button
            onClick={() =>
              router.push(
                "/register"
              )
            }
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white py-3 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
          >
            Create your account
          </button>

        </div>

      </div>

    </main>
  );
}