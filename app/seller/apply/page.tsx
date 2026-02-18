"use client";

import { useState } from "react";

export default function ApplySellerPage() {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    gstNumber: "",
    panNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seller/apply`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Application submitted successfully 🎉");
    } catch (err: any) {
      setMessage(err.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-28">
      <h1 className="text-2xl font-bold mb-6">
        Apply as Seller
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Store Name"
          className="border w-full p-3 rounded-md"
          onChange={(e) =>
            setForm({ ...form, storeName: e.target.value })
          }
        />

        <textarea
          placeholder="Store Description"
          className="border w-full p-3 rounded-md"
          onChange={(e) =>
            setForm({
              ...form,
              storeDescription: e.target.value,
            })
          }
        />

        <input
          placeholder="GST Number"
          className="border w-full p-3 rounded-md"
          onChange={(e) =>
            setForm({ ...form, gstNumber: e.target.value })
          }
        />

        <input
          placeholder="PAN Number"
          className="border w-full p-3 rounded-md"
          onChange={(e) =>
            setForm({ ...form, panNumber: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-md w-full"
        >
          {loading ? "Submitting..." : "Apply"}
        </button>

        {message && (
          <p className="text-sm mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
