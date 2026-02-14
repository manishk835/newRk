"use client";

import { useState } from "react";

export default function SecurityPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordStrength = () => {
    if (newPassword.length < 6) return "Weak";
    if (newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/))
      return "Strong";
    return "Medium";
  };

  const isValid =
    currentPassword.length >= 6 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to change password");
        return;
      }

      setMessage("Password updated successfully");
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
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold dark:text-white">
          Account Security
        </h2>
        <p className="text-sm text-gray-500">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 border rounded-3xl p-8 space-y-6 shadow-sm"
      >

        {/* CURRENT PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700"
          />
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700"
          />

          {newPassword && (
            <p
              className={`text-xs mt-2 ${
                passwordStrength() === "Strong"
                  ? "text-green-600"
                  : passwordStrength() === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Strength: {passwordStrength()}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full mt-2 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700"
          />

          {confirmPassword &&
            newPassword !== confirmPassword && (
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
          className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* SECURITY TIPS */}
      <div className="bg-gray-50 dark:bg-gray-800 border rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium mb-2">
          Security Tips
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Use at least 8 characters</li>
          <li>Include numbers and uppercase letters</li>
          <li>Do not reuse old passwords</li>
        </ul>
      </div>

    </div>
  );
}
