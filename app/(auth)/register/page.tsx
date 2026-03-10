"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {

  const router = useRouter();
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ================= REDIRECT IF LOGGED IN ================= */

  useEffect(() => {

    if (!loading && user) {
      router.replace("/");
    }

  }, [user, loading, router]);

  /* ================= VALIDATION ================= */

  const validate = () => {

    if (!firstName.trim()) {
      setError("Enter first name");
      return false;
    }

    if (!email) {
      setError("Enter email address");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email address");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid phone number");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;

  };

  /* ================= SUBMIT ================= */

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {

      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim().toLowerCase(),
            phone,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        if (data.message?.includes("already")) {

          setError("Email already registered. Please login.");

          return;
        }

        throw new Error(data.message || "Registration failed");

      }

      router.push(`/verify-otp?phone=${phone}`);

    } catch (err: any) {

      setError(err.message || "Something went wrong");

    } finally {

      setSubmitting(false);

    }

  };

  if (loading) return null;

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Create your account
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to start shopping
        </p>

        {/* GOOGLE LOGIN */}

        <button
          className="w-full border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          onClick={() =>
            window.location.href =
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
          }
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />

          Continue with Google

        </button>

        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-3 text-xs text-gray-400">OR</span>

          <div className="flex-1 h-px bg-gray-200"></div>

        </div>

        <form onSubmit={submit} className="space-y-4">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>

        </form>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">

          Already have an account?{" "}

          <button
            onClick={() => router.push("/login")}
            className="text-black font-medium hover:underline"
          >
            Sign in
          </button>

        </p>

      </div>

    </main>

  );

}