"use client";

import { Product } from "../types/product";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
  products: Product[];
};

export default function ProductTable({ products }: Props) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {filtered.map((p) => {
              const totalStock =
                p.variants?.reduce(
                  (acc, v) => acc + (v.stock || 0),
                  0
                ) || 0;

              return (
                <tr key={p._id} className="border-t hover:bg-gray-50">

                  {/* PRODUCT */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        p.images?.[0]?.url ||
                        p.thumbnail ||
                        "/placeholder.png"
                      }
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.subCategory || ""}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-3 text-center capitalize">
                    {p.category}
                  </td>

                  {/* PRICE */}
                  <td className="p-3 text-center">
                    ₹
                    {p.price ||
                      p.variants?.[0]?.priceOverride ||
                      0}
                  </td>

                  {/* STOCK */}
                  <td className="p-3 text-center">
                    {totalStock}
                  </td>

                  {/* STATUS */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        p.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.isApproved ? "Active" : "Pending"}
                    </span>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>
      </div>

    </div>
  );
}