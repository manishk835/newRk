// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import {  createCategory } from "@/lib/api/admin/categories";
import {  fetchCategories } from "@/lib/api/admin/categories";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const handleAdd = async () => {
    if (!name) return;
    setLoading(true);
    await createCategory({ name });
    setName("");
    await load();
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 pt-28 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        Categories
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Category name"
          className="border px-4 py-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Link
          href="/admin/categories/add"
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          + Add Category
        </Link>
      </div>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c._id}
            className="border p-3 rounded flex justify-between"
          >
            <span>{c.name}</span>
            <span className="text-sm text-gray-500">
              {c.slug}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
