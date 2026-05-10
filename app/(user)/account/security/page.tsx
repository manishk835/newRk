"use client";

import { useState } from "react";

export default function SecurityPage() {

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const passwordStrength = () => {

    if (newPassword.length < 6)
      return "Weak";

    if (
      newPassword.match(/[A-Z]/) &&
      newPassword.match(/[0-9]/)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const isValid =
    currentPassword.length >= 6 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!isValid) return;

    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/auth/change-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
            "Failed to change password"
        );

        return;
      }

      setMessage(
        "Password updated successfully 🎉"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch {

      setError("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-xl space-y-8">

      {/* HEADER */}
      <div>

        <h2 className="text-xl font-semibold text-black dark:text-white">
          Account Security
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your password to keep your account secure.
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-sm transition-colors duration-300"
      >

        {/* CURRENT PASSWORD */}
        <div>

          <label className="text-sm font-medium text-black dark:text-white">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            className="w-full mt-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />

        </div>

        {/* NEW PASSWORD */}
        <div>

          <label className="text-sm font-medium text-black dark:text-white">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full mt-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />

          {newPassword && (
            <p
              className={`text-xs mt-2 ${
                passwordStrength() ===
                "Strong"
                  ? "text-green-600"
                  : passwordStrength() ===
                    "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Strength:{" "}
              {passwordStrength()}
            </p>
          )}

        </div>

        {/* CONFIRM PASSWORD */}
        <div>

          <label className="text-sm font-medium text-black dark:text-white">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full mt-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />

          {confirmPassword &&
            newPassword !==
              confirmPassword && (
              <p className="text-xs text-red-600 mt-2">
                Passwords do not match
              </p>
            )}

        </div>

        {/* MESSAGE */}
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="text-sm text-green-600">
            {message}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </form>

      {/* SECURITY TIPS */}
      <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">

        <p className="font-medium text-black dark:text-white mb-2">
          Security Tips
        </p>

        <ul className="space-y-1 list-disc list-inside">
          <li>Use at least 8 characters</li>
          <li>
            Include numbers and uppercase letters
          </li>
          <li>
            Do not reuse old passwords
          </li>
        </ul>

      </div>

    </div>
  );
}