"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type ProductForm = {
  title: string;
  price: number;
  description: string;
  totalStock: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductForm>({
    title: "",
    price: 0,
    description: "",
    totalStock: 0,
  });

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiFetch(`/products/id/${productId}`);

        setForm({
          title: data.title || "",
          price: data.price || 0,
          description: data.description || "",
          totalStock: data.totalStock || 0,
        });

      } catch (err: any) {
        console.error("Load product error", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) loadProduct();
  }, [productId]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]:
        name === "price" || name === "totalStock"
          ? Number(value)
          : value,
    }));
  };

  /* ================= UPDATE PRODUCT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await apiFetch(`/seller/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      alert("Product updated. Waiting for admin approval.");

      router.push("/seller/products");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Edit Product
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl border shadow-sm"
      >

        {/* TITLE */}

        <div>
          <label className="block text-sm mb-2 font-medium">
            Product Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />
        </div>

        {/* PRICE */}

        <div>
          <label className="block text-sm mb-2 font-medium">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />
        </div>

        {/* STOCK */}

        <div>
          <label className="block text-sm mb-2 font-medium">
            Stock
          </label>

          <input
            type="number"
            name="totalStock"
            value={form.totalStock}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block text-sm mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-4 py-3 rounded-lg"
          />
        </div>

        {/* BUTTON */}

        <button
          disabled={saving}
          className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-900 transition"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

      </form>
    </div>
  );
}