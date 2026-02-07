// components/header/CategoryMenu.tsx

"use client";

import { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { Category } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= FIXED HEADER CATEGORIES ================= */
const MAIN_CATEGORIES = [
  { name: "Men", slug: "men" },
  { name: "Women", slug: "women" },
  { name: "Kids", slug: "kids" },
  { name: "Footwear", slug: "footwear" },
];

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`, {
          cache: "no-store",
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return null;

  return (
    <div className="flex gap-6">
      {MAIN_CATEGORIES.map((parent) => {
        /* ================= CHILDREN FROM BACKEND ================= */
        const children = categories.filter(
          (c) =>
            c.parentSlug === parent.slug ||
            c.parent === parent.slug // fallback if needed
        );

        return (
          <CategoryItem
            key={parent.slug}
            parent={{
              _id: parent.slug, // fake id for UI
              name: parent.name,
              slug: parent.slug,
              parent: null,
            }}
            allCategories={children}
          />
        );
      })}
    </div>
  );
}
