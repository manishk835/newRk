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
    p.name.toLowerCase().includes(search.toLowerCase())
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

                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      className="w-10 h-10 rounded object-cover"
                    />
                    {p.name}
                  </td>

                  <td className="p-3 text-center">{p.category}</td>

                  <td className="p-3 text-center">
                    ₹{p.variants?.[0]?.price ?? 0}
                  </td>

                  <td className="p-3 text-center">{totalStock}</td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-1 text-xs bg-green-100 rounded">
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