"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/api";
import { AdminProduct } from "@/lib/types/adminProduct";

/* ================= TYPES ================= */

// type Product = {
//   _id: string;
//   title: string;
//   price: number;
//   category: string;
//   subCategory?: string;
//   isActive: boolean;
//   isFeatured: boolean;
//   isNewArrival: boolean;
//   createdAt: string;
// };

/* ================= PAGE ================= */

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data as AdminProduct[]);
      } catch (err) {
        console.error(err);
        alert("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Products
        </h1>

        <button
          onClick={() =>
            router.push("/admin/products/create")
          }
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
        >
          + Add Product
        </button>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="text-gray-600">
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  Title
                </th>
                <th className="px-4 py-3 text-center">
                  Category
                </th>
                <th className="px-4 py-3 text-center">
                  Price
                </th>
                <th className="px-4 py-3 text-center">
                  Flags
                </th>
                <th className="px-4 py-3 text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-center">
                  Created
                </th>
                <th className="px-4 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {p.title}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center capitalize">
                    {p.category}
                    {p.subCategory
                      ? ` / ${p.subCategory}`
                      : ""}
                  </td>

                  <td className="px-4 py-3 text-center">
                    ₹{p.price}
                  </td>

                  <td className="px-4 py-3 text-center space-x-1">
                    {p.isFeatured && (
                      <span className="inline-block text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {p.isNewArrival && (
                      <span className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {p.isActive ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {new Date(
                      p.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/products/${p._id}`
                        )
                      }
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
