// app/(auth)/reset-verify/page.tsx

"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function ResetVerifyPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const phone =
    searchParams.get(
      "phone"
    ) || "";

  const [otp, setOtp] =
    useState<string[]>([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [error, setError] =
    useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    resending,
    setResending,
  ] = useState(false);

  const [
    cooldown,
    setCooldown,
  ] = useState(0);

  const inputs =
    useRef<
      (
        | HTMLInputElement
        | null
      )[]
    >([]);

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (!phone) {

      router.replace(
        "/forgot-password"
      );

    }

  }, [
    phone,
    router,
  ]);

  /* ================= TIMER ================= */

  useEffect(() => {

    if (
      cooldown <= 0
    ) {
      return;
    }

    const timer =
      setInterval(
        () => {

          setCooldown(
            (prev) =>
              prev - 1
          );

        },
        1000
      );

    return () =>
      clearInterval(
        timer
      );

  }, [cooldown]);

  /* ================= OTP INPUT ================= */

  const handleChange =
    (
      value: string,
      index: number
    ) => {

      if (
        !/^\d?$/.test(
          value
        )
      ) {
        return;
      }

      const newOtp = [
        ...otp,
      ];

      newOtp[index] =
        value;

      setOtp(newOtp);

      if (
        value &&
        index < 5
      ) {

        inputs.current[
          index + 1
        ]?.focus();

      }
    };

  const handleKeyDown =
    (
      e: any,
      index: number
    ) => {

      if (
        e.key ===
          "Backspace" &&
        !otp[index] &&
        index > 0
      ) {

        inputs.current[
          index - 1
        ]?.focus();

      }
    };

  /* ================= VERIFY ================= */

  const handleVerify =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      const code =
        otp.join("");

      if (
        code.length !== 6
      ) {

        setError(
          "Enter 6 digit OTP"
        );

        return;
      }

      try {

        setLoading(
          true
        );

        const res =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-otp`,
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
                  otp: code,
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
              "OTP verification failed"
          );

        }

        setSuccess(
          "OTP verified successfully 🎉"
        );

        setTimeout(
          () => {

            router.push(
              `/reset-password?phone=${phone}`
            );

          },
          1200
        );

      } catch (
        err: any
      ) {

        setError(
          err.message ||
            "Verification failed"
        );

      } finally {

        setLoading(
          false
        );

      }
    };

  /* ================= RESEND ================= */

  const handleResend =
    async () => {

      if (
        cooldown > 0
      ) {
        return;
      }

      try {

        setResending(
          true
        );

        setError("");

        setSuccess("");

        const res =
          await fetch(
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

        const data =
          await res.json();

        if (
          !res.ok
        ) {

          throw new Error(
            data.message ||
              "Failed to resend OTP"
          );

        }

        setSuccess(
          "OTP sent again 📩"
        );

        setCooldown(
          30
        );

      } catch (
        err: any
      ) {

        setError(
          err.message ||
            "Failed to resend OTP"
        );

      } finally {

        setResending(
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
            Verify OTP
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Enter the 6 digit code sent to your registered mobile number
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleVerify
          }
          className="space-y-6"
        >

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-3">

            {otp.map(
              (
                digit,
                index
              ) => (

                <input
                  key={
                    index
                  }
                  ref={(
                    el
                  ) => {
                    inputs.current[
                      index
                    ] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={
                    digit
                  }
                  onChange={(
                    e
                  ) =>
                    handleChange(
                      e.target
                        .value,
                      index
                    )
                  }
                  onKeyDown={(
                    e
                  ) =>
                    handleKeyDown(
                      e,
                      index
                    )
                  }
                  className="w-12 h-14 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-2xl text-center text-xl font-semibold outline-none focus:ring-2 focus:ring-[#F5A623]"
                />

              )
            )}

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
              ? "Verifying..."
              : "Verify OTP"}

          </button>

        </form>

        {/* RESEND */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">

          <button
            onClick={
              handleResend
            }
            disabled={
              resending ||
              cooldown > 0
            }
            className="text-sm text-[#F5A623] hover:underline disabled:opacity-50"
          >

            {resending
              ? "Sending..."
              : cooldown >
                0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}

          </button>

        </div>

      </div>

    </main>
  );
}