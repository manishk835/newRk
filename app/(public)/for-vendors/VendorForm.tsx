"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ui-utils";

/* ================= CONSTANTS ================= */

const BUSINESS_TYPES = [
  "Clothing",
  "Footwear",
  "Accessories",
  "Beauty",
  "Jewelry",
  "Electronics",
  "Home Decor",
];

/* ================= PAGE ================= */

export default function VendorForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  /* ================= HANDLE ================= */

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    if (!form.businessName.trim()) return "Business name required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) return "Valid phone required";
    if (!form.businessType) return "Select business category";
    return "";
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!user) {
      router.push("/login?redirect=/for-vendors");
      return;
    }

    if (user.sellerStatus === "approved") {
      router.push("/seller");
      return;
    }

    if (user.sellerStatus === "pending") {
      showToast("Already under review", "error");
      return;
    }

    const validation = validate();
    if (validation) {
      showToast(validation, "error");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/vendors/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 🔥 IMPORTANT FIX
        },
        body: JSON.stringify({
          businessName: form.businessName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          businessType: form.businessType,
          message: form.message.trim(),
        }),
      });

      showToast("Application submitted successfully", "success");

      // 🔥 UX IMPROVEMENT
      router.push("/"); // redirect after submit

      setForm({
        businessName: "",
        email: "",
        phone: "",
        businessType: "",
        message: "",
      });

    } catch (err: any) {
      showToast(err.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border p-8 rounded-2xl shadow-sm max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold text-center">
        Become a Seller
      </h2>

      <Input
        label="Business Name"
        name="businessName"
        value={form.businessName}
        onChange={handleChange}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        label="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
      />

      <div>
        <label className="block mb-2 text-sm font-medium">
          Business Category
        </label>

        <select
          required
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
          className="w-full border px-4 py-3 rounded-lg"
        >
          <option value="">Select category</option>

          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="message"
        placeholder="Tell us about your brand..."
        value={form.message}
        onChange={handleChange}
        className="w-full border px-4 py-3 rounded-lg"
      />

      <button
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-4 py-3 rounded-lg"
      />
    </div>
  );
}