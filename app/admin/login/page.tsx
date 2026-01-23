"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Simple admin gate (frontend only)
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/orders");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 max-w-md">
      <h1 className="text-2xl font-bold mb-6">
        Admin Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4 border p-6 rounded-lg"
      >
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
