"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "men",
  });

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchProducts();
  }, [router, token]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
      }),
    });

    setForm({
      title: "",
      slug: "",
      price: "",
      originalPrice: "",
      image: "",
      category: "men",
    });

    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">Admin Products</h1>

      {/* ADD PRODUCT */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 border p-4 rounded"
      >
        <input placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border px-3 py-2" />

        <input placeholder="Slug" value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border px-3 py-2" />

        <input placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border px-3 py-2" />

        <input placeholder="Original Price" value={form.originalPrice}
          onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
          className="border px-3 py-2" />

        <input placeholder="Image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border px-3 py-2" />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border px-3 py-2"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="footwear">Footwear</option>
        </select>

        <button className="bg-black text-white py-2 rounded col-span-full">
          Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p._id} className="border p-4 flex justify-between">
            <div>
              <b>{p.title}</b>
              <p className="text-sm">₹{p.price}</p>
            </div>
            <button
              onClick={() => deleteProduct(p._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
