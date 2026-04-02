// 📄 app/(admin)/admin/security/page.tsx

"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SecurityPage() {
  const [qr, setQr] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const enable2FA = async () => {
    const res = await fetch(`${API}/api/admin/2fa/enable`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    setQr(data.qr);
  };

  const verify = async () => {
    const res = await fetch(`${API}/api/admin/2fa/verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: otp }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Security Settings</h1>

      <button
        onClick={enable2FA}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Enable 2FA
      </button>

      {qr && (
        <div className="mt-4">
          <img src={qr} alt="QR Code" className="w-48" />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border px-3 py-2 mt-3 block"
          />
          <button
            onClick={verify}
            className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
          >
            Verify
          </button>
        </div>
      )}

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}