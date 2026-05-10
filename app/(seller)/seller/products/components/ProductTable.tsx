"use client";

import { useState } from "react";

import { Product } from "../types/product";

import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */

type Props = {
  products: Product[];
};

/* ================= COMPONENT ================= */

export default function ProductTable({
  products,
}: Props) {

  const [search, setSearch] =
    useState("");

  /* ================= FILTER ================= */

  const filtered =
    products.filter((p) =>
      p.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="space-y-5">

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">

        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
        />

      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEAD */}
            <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">

              <tr>

                <th className="p-4 text-left font-medium">
                  Product
                </th>

                <th className="p-4 text-center font-medium">
                  Category
                </th>

                <th className="p-4 text-center font-medium">
                  Price
                </th>

                <th className="p-4 text-center font-medium">
                  Stock
                </th>

                <th className="p-4 text-center font-medium">
                  Status
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {filtered.length ===
                0 && (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center p-10 text-gray-500 dark:text-gray-400"
                  >
                    No products found
                  </td>

                </tr>

              )}

              {filtered.map((p) => {

                const totalStock =
                  p.variants?.reduce(
                    (
                      acc,
                      v
                    ) =>
                      acc +
                      (v.stock ||
                        0),
                    0
                  ) || 0;

                return (
                  <tr
                    key={p._id}
                    className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                  >

                    {/* PRODUCT */}
                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={
                            p
                              .images?.[0]
                              ?.url ||
                            p.thumbnail ||
                            "/placeholder.png"
                          }
                          alt={
                            p.name
                          }
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-zinc-700"
                        />

                        <div>

                          <p className="font-medium text-black dark:text-white line-clamp-1">
                            {p.name}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {p.subCategory ||
                              "No subcategory"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}
                    <td className="p-4 text-center capitalize text-black dark:text-white">

                      {p.category}

                    </td>

                    {/* PRICE */}
                    <td className="p-4 text-center font-medium text-black dark:text-white">

                      ₹
                      {p.price ||
                        p
                          .variants?.[0]
                          ?.priceOverride ||
                        0}

                    </td>

                    {/* STOCK */}
                    <td className="p-4 text-center">

                      <span
                        className={`font-medium ${
                          totalStock ===
                          0
                            ? "text-red-600"
                            : totalStock <=
                              5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {totalStock}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          p.isApproved
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
                        }`}
                      >
                        {p.isApproved
                          ? "Active"
                          : "Pending"}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}