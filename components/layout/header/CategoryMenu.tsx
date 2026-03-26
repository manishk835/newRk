"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface Category {
  _id?: string;
  name: string;
  slug: string;
  parent?: string;
  parentSlug?: string;
}

/* ================= COMPONENT ================= */

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Category load failed:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* ================= STRUCTURE ================= */

  const parentCategories = categories.filter(
    (c) => !c.parent && !c.parentSlug
  );

  const getSubCategories = (parentSlug: string) => {
    return categories.filter(
      (c) =>
        c.parentSlug === parentSlug ||
        c.parent === parentSlug
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-8 min-w-150">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-200 mb-3 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-14 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */

  if (!parentCategories.length) {
    return (
      <div className="min-w-100 text-sm text-gray-500">
        No categories found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 min-w-150">

      {parentCategories.map((parent) => {
        const subCats = getSubCategories(parent.slug);

        return (
          <div key={parent.slug} className="min-w-37.5">

            {/* PARENT TITLE */}
            <Link
              href={`/?category=${parent.slug}`}
              className="block font-semibold text-sm mb-3 text-gray-900 hover:text-black transition"
            >
              {parent.name}
            </Link>

            {/* SUB CATEGORIES */}
            <div className="flex flex-col gap-2">
              {subCats.length > 0 ? (
                subCats.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/?category=${sub.slug}`}
                    className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                  >
                    {sub.name}
                  </Link>
                ))
              ) : (
                <span className="text-xs text-gray-400">
                  No subcategories
                </span>
              )}
            </div>

          </div>
        );
      })}

    </div>
  );
}