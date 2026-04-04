"use client";

import { Product } from "../types/product";

type Props = {
  products: Product[];
};

export default function ProductStats({ products }: Props) {
  const total = products.length;

  const lowStock = products.filter((p) =>
    (p.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0) <= 5
  ).length;

  const active = products.filter((p) => p.isApproved).length;

  return (
    <div className="grid grid-cols-3 gap-4">

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Total</p>
        <h3 className="text-xl font-bold">{total}</h3>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Low Stock</p>
        <h3 className="text-xl font-bold">{lowStock}</h3>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Active</p>
        <h3 className="text-xl font-bold">{active}</h3>
      </div>

    </div>
  );
}