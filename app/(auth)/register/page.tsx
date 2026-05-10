// app/(auth)/register/page.tsx

"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {

  const router =
    useRouter();

  const {
    user,
    loading,
  } = useAuth();

  const [phone, setPhone] =
    useState("");

  const [name, setName] =
    useState("");

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

  const [
    cooldown,
    setCooldown,
  ] = useState(0);

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

  /* ================= COOLDOWN ================= */

  useEffect(() => {

    if (
      cooldown <= 0
    ) {
      return;
    }

    const timer =
      setInterval(() => {

        setCooldown(
          (prev) =>
            prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(
        timer
      );

  }, [cooldown]);

  /* ================= SAFE FETCH ================= */

  const safeFetch =
    async (
      url: string,
      options: any,
      timeout = 10000
    ) => {

      const controller =
        new AbortController();

      const id =
        setTimeout(
          () =>
            controller.abort(),
          timeout
        );

      try {

        const res =
          await fetch(
            url,
            {
              ...options,
              signal:
                controller.signal,
            }
          );

        clearTimeout(id);

        return res;

      } catch {

        clearTimeout(id);

        throw new Error(
          "Network timeout. Try again."
        );

      }
    };

  /* ================= SUBMIT ================= */

  const submit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      /* PHONE */
      if (
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {

        return setError(
          "Enter valid mobile number"
        );
      }

      /* NAME */
      if (
        !name.trim() ||
        name.length < 3
      ) {

        return setError(
          "Enter valid name"
        );
      }

      /* PASSWORD */
      if (
        password.length <
        6
      ) {

        return setError(
          "Password must be at least 6 characters"
        );
      }

      try {

        setSubmitting(
          true
        );

        const res =
          await safeFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  name:
                    name.trim(),

                  phone,

                  password,
                }
              ),
            }
          );

        let data: any =
          {};

        try {

          data =
            await res.json();

        } catch {

          throw new Error(
            "Invalid server response"
          );

        }

        if (
          !res.ok
        ) {

          throw new Error(
            data?.message ||
              "Registration failed"
          );

        }

        /* SPAM PREVENTION */
        setCooldown(
          30
        );

        /* STORE PHONE */
        sessionStorage.setItem(
          "verify_phone",
          phone
        );

        router.push(
          `/verify-otp?identifier=${phone}`
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
            Create your account
          </p>

        </div>

        {/* TITLE */}
        <div className="mb-6">

          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Register
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Start shopping with RKFashion
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            submit
          }
          className="space-y-5"
        >

          {/* BOT TRAP */}
          <input
            type="text"
            style={{
              display:
                "none",
            }}
            autoComplete="off"
            tabIndex={-1}
          />

          {/* ERROR */}
          {error && (

            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>

          )}

          {/* PHONE */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Mobile Number
            </label>

            <div className="flex gap-3">

              <div className="border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl">
                +91
              </div>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={
                  phone
                }
                onChange={(
                  e
                ) =>
                  setPhone(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter mobile number"
                className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
              />

            </div>

          </div>

          {/* NAME */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your name"
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
              placeholder="Create password"
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 6 characters.
            </p>

          </div>

          {/* BUTTON */}
          <button
            disabled={
              submitting ||
              cooldown >
                0
            }
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >

            {submitting
              ? "Sending OTP..."
              : cooldown >
                0
              ? `Wait ${cooldown}s`
              : "Verify Mobile Number"}

          </button>

        </form>

        {/* LOGIN */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Already have an account?
          </p>

          <button
            onClick={() =>
              router.push(
                "/login"
              )
            }
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white py-3 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
          >
            Sign In Instead
          </button>

        </div>

        {/* TERMS */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6 leading-relaxed">
          By creating an account,
          you agree to RKFashion's
          terms and conditions.
        </p>

      </div>

    </main>
  );
}