// app/(auth)/forgot-password/page.tsx

"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function ForgotPasswordPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const queryPhone =
    searchParams.get(
      "phone"
    ) || "";

  const [phone, setPhone] =
    useState(
      queryPhone
    );

  const [error, setError] =
    useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  /* ================= AUTO FILL ================= */

  useEffect(() => {

    if (
      queryPhone
    ) {

      setPhone(
        queryPhone
      );

    }

  }, [queryPhone]);

  /* ================= VALIDATION ================= */

  const validate =
    () => {

      if (!phone) {

        setError(
          "Enter mobile number"
        );

        return false;
      }

      if (
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {

        setError(
          "Enter valid 10 digit mobile number"
        );

        return false;
      }

      return true;
    };

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
          "Network error. Try again."
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
          await safeFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
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
                }
              ),
            }
          );

        let data: any =
          {};

        try {

          data =
            await res.json();

        } catch {}

        if (
          !res.ok
        ) {

          throw new Error(
            data?.message ||
              "Failed to send OTP"
          );

        }

        /* SUCCESS */
        setSuccess(
          "OTP sent successfully"
        );

        setTimeout(
          () => {

            router.push(
              `/reset-verify?phone=${phone}`
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

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Enter your registered mobile number to receive a reset OTP
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            submit
          }
          className="space-y-5"
        >

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
                placeholder="Enter mobile number"
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
                disabled={
                  loading
                }
                className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#F5A623]"
              />

            </div>

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
              ? "Sending OTP..."
              : "Send Reset OTP"}

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