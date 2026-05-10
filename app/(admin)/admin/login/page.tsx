// 📄 app/(admin)/admin/login/page.tsx

"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL;

/* ================= PAGE ================= */

export default function AdminLoginPage() {

  const router =
    useRouter();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
      otp: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    attempts,
    setAttempts,
  ] = useState(0);

  /* ================= INPUT ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* ================= VALIDATION ================= */

  const validate =
    () => {

      if (
        !/^\S+@\S+\.\S+$/.test(
          form.email
        )
      ) {
        return "Valid email required";
      }

      if (
        form.password.length <
        6
      ) {
        return "Password must be at least 6 characters";
      }

      return "";
    };

  /* ================= LOGIN ================= */

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      /* UI RATE LIMIT */
      if (
        attempts >= 5
      ) {

        setError(
          "Too many attempts. Please wait."
        );

        return;
      }

      /* VALIDATE */
      const validation =
        validate();

      if (validation) {

        setError(
          validation
        );

        return;
      }

      try {

        setLoading(
          true
        );

        const res =
          await fetch(
            `${API_URL}/api/admin/login`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  email:
                    form.email,

                  password:
                    form.password,

                  otp:
                    form.otp ||
                    undefined,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (
          !res.ok
        ) {

          setAttempts(
            (
              prev
            ) =>
              prev +
              1
          );

          setError(
            data.message ||
              "Invalid credentials"
          );

          return;
        }

        /* VERIFY SESSION */
        const verify =
          await fetch(
            `${API_URL}/api/admin/me`,
            {
              credentials:
                "include",
            }
          );

        if (
          !verify.ok
        ) {

          setError(
            "Session verification failed"
          );

          return;
        }

        /* SUCCESS */
        router.replace(
          "/admin"
        );

      } catch {

        setError(
          "Server error. Please try again."
        );

      } finally {

        setLoading(
          false
        );

      }
    };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4 transition-colors duration-300">

      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">

        {/* LOGO */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-black dark:text-white">
            RK
            <span className="text-[#F5A623]">
              Admin
            </span>
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Secure access to admin panel
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

            <div className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 rounded-2xl">
              {error}
            </div>

          )}

          {/* EMAIL */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              required
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

          </div>

          {/* PASSWORD */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-black dark:text-white">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              required
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />

          </div>

          {/* OPTIONAL OTP */}
          {/*
          <div className="space-y-2">
            <label className="text-sm font-medium text-black dark:text-white">
              OTP
            </label>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-2xl outline-none"
            />
          </div>
          */}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

          {/* SECURITY */}
          <div className="pt-2">

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Protected by secure authentication
            </p>

            {attempts >
              0 && (

              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                Failed attempts:{" "}
                {attempts}/5
              </p>

            )}

          </div>

        </form>

      </div>

    </div>
  );
}