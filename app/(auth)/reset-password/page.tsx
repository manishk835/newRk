// app/(auth)/reset-password/page.tsx

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

export default function ResetPasswordPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const phone =
    searchParams.get(
      "phone"
    ) || "";

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirm,
    setConfirm,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (!phone) {

      router.replace(
        "/login"
      );

    }

  }, [
    phone,
    router,
  ]);

  useEffect(() => {

    if (
      !authLoading &&
      user
    ) {

      router.replace(
        "/"
      );

    }

  }, [
    user,
    authLoading,
    router,
  ]);

  /* ================= VALIDATION ================= */

  const validate =
    () => {

      if (
        password.length <
        8
      ) {

        setError(
          "Password must be at least 8 characters"
        );

        return false;
      }

      if (
        password !==
        confirm
      ) {

        setError(
          "Passwords do not match"
        );

        return false;
      }

      return true;
    };

  /* ================= SUBMIT ================= */

  const submit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      if (
        !validate()
      ) {
        return;
      }

      try {

        setLoading(
          true
        );

        const res =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  phone,
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
              "Reset failed"
          );

        }

        setSuccess(
          "Password updated successfully 🎉"
        );

        setTimeout(
          () => {

            router.replace(
              "/login?reset=success"
            );

          },
          1200
        );

      } catch (
        err: any
      ) {

        setError(
          err.message ||
            "Something went wrong"
        );

      } finally {

        setLoading(
          false
        );

      }
    };

  /* ================= LOADING ================= */

  if (authLoading)
    return null;

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">

      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm p-8 relative transition-colors duration-300">

        {/* CLOSE */}
        <button
          onClick={() =>
            router.push(
              "/login"
            )
          }
          className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-black dark:text-white">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Create a new secure password
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            submit
          }
          className="space-y-5"
        >

          {/* PASSWORD */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters.
            </p>

          </div>

          {/* CONFIRM */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={
                confirm
              }
              onChange={(e) =>
                setConfirm(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
            />

          </div>

          {/* ERROR */}
          {error && (

            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-2xl text-center">
              {error}
            </div>

          )}

          {/* SUCCESS */}
          {success && (

            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-300 text-sm px-4 py-3 rounded-2xl text-center">
              {success}
            </div>

          )}

          {/* BUTTON */}
          <button
            disabled={
              loading
            }
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>

        {/* BACK */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">

          <button
            onClick={() =>
              router.push(
                "/login"
              )
            }
            className="text-sm text-[#F5A623] hover:underline"
          >
            Back to Login
          </button>

        </div>

      </div>

    </main>
  );
}