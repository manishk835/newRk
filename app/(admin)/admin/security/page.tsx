// 📄 app/(admin)/admin/security/page.tsx

"use client";

import {
  useState,
} from "react";

const API =
  process.env
    .NEXT_PUBLIC_API_URL;

/* ================= PAGE ================= */

export default function SecurityPage() {

  const [qr, setQr] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    verifying,
    setVerifying,
  ] = useState(false);

  /* ================= ENABLE ================= */

  const enable2FA =
    async () => {
      try {

        setLoading(true);

        setMsg("");

        const res =
          await fetch(
            `${API}/api/admin/2fa/enable`,
            {
              method:
                "POST",

              credentials:
                "include",
            }
          );

        const data =
          await res.json();

        setQr(data.qr);

      } catch {

        setMsg(
          "Failed to enable 2FA"
        );

      } finally {

        setLoading(false);

      }
    };

  /* ================= VERIFY ================= */

  const verify =
    async () => {
      try {

        setVerifying(
          true
        );

        const res =
          await fetch(
            `${API}/api/admin/2fa/verify`,
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
                  token: otp,
                }
              ),
            }
          );

        const data =
          await res.json();

        setMsg(
          data.message
        );

      } catch {

        setMsg(
          "Verification failed"
        );

      } finally {

        setVerifying(
          false
        );

      }
    };

  /* ================= UI ================= */

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          Security Settings
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Protect your admin account using two-factor authentication
        </p>

      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">

        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h2 className="text-lg font-semibold text-black dark:text-white">
              Two-Factor Authentication
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add an extra security layer to your admin account
            </p>

          </div>

          <button
            onClick={
              enable2FA
            }
            disabled={
              loading
            }
            className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >

            {loading
              ? "Generating..."
              : "Enable 2FA"}

          </button>

        </div>

        {/* QR */}
        {qr && (

          <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">

            <div className="grid lg:grid-cols-2 gap-8 items-start">

              {/* QR IMAGE */}
              <div>

                <h3 className="font-medium text-black dark:text-white mb-4">
                  Scan QR Code
                </h3>

                <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-5 inline-block">

                  <img
                    src={qr}
                    alt="QR Code"
                    className="w-56 h-56 object-contain"
                  />

                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 max-w-sm">
                  Scan this QR code using Google Authenticator or Authy app
                </p>

              </div>

              {/* VERIFY */}
              <div>

                <h3 className="font-medium text-black dark:text-white mb-4">
                  Verify OTP
                </h3>

                <div className="space-y-4">

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(
                      e
                    ) =>
                      setOtp(
                        e.target
                          .value
                      )
                    }
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
                  />

                  <button
                    onClick={
                      verify
                    }
                    disabled={
                      verifying ||
                      !otp
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-50"
                  >

                    {verifying
                      ? "Verifying..."
                      : "Verify OTP"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

      {/* MESSAGE */}
      {msg && (

        <div
          className={`border rounded-2xl px-5 py-4 text-sm ${
            msg
              .toLowerCase()
              .includes(
                "success"
              ) ||
            msg
              .toLowerCase()
              .includes(
                "verified"
              )
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-300"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300"
          }`}
        >
          {msg}
        </div>

      )}

    </div>
  );
}