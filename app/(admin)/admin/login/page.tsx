// 📄 app/(admin)/admin/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "", // 🔥 future 2FA ready
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  /* ================= INPUT ================= */

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Valid email required";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  /* ================= LOGIN ================= */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // 🔥 basic brute force protection (UI level)
    if (attempts >= 5) {
      setError("Too many attempts. Please wait.");
      return;
    }

    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        credentials: "include", // 🔐 cookie auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          otp: form.otp || undefined, // 🔥 future MFA
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAttempts((prev) => prev + 1);
        setError(data.message || "Invalid credentials");
        return;
      }

      /* ================= VERIFY SESSION ================= */

      const verify = await fetch(`${API_URL}/api/admin/me`, {
        credentials: "include",
      });

      if (!verify.ok) {
        setError("Session verification failed");
        return;
      }

      // ✅ success
      router.replace("/admin");

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm">

        <h1 className="text-2xl font-bold mb-1">
          Admin Login
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Secure access to admin panel
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* ERROR */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          {/* 🔐 FUTURE 2FA (optional UI) */}
          {/* Uncomment when backend ready */}
          {/*
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP (if enabled)"
            value={form.otp}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />
          */}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SECURITY INFO */}
          <p className="text-xs text-gray-400 text-center mt-2">
            Protected by secure authentication
          </p>

        </form>

      </div>

    </div>
  );
}