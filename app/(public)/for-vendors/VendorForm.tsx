"use client";

import { useState } from "react";

export default function VendorForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      businessName: formData.get("businessName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      category: formData.get("category"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-md"
    >
      <Input name="businessName" label="Business Name" required />
      <Input name="email" label="Business Email" type="email" required />
      <Input name="phone" label="Phone Number" required />
      <Input name="category" label="Product Category" required />
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Tell us about your brand
        </label>
        <textarea
          name="message"
          rows={4}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {success && (
        <p className="text-green-600 text-center mt-4">
          Application submitted successfully!
        </p>
      )}
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>
  );
}