"use client";

import { Product } from "../types/product";

type Props = {
  products: Product[];
};

export default function ProductStats({ products }: Props) {

  const total = products.length;

  const getStock = (p: Product) =>
    p.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

  const lowStock = products.filter((p) => getStock(p) <= 5).length;

  const active = products.filter(
    (p) => p.isApproved && p.isActive !== false
  ).length;

  const outOfStock = products.filter((p) => getStock(p) === 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {/* TOTAL */}
      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Total Products</p>
        <h3 className="text-xl font-bold">{total}</h3>
      </div>

      {/* ACTIVE */}
      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Active</p>
        <h3 className="text-xl font-bold">{active}</h3>
      </div>

      {/* LOW STOCK */}
      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Low Stock</p>
        <h3 className="text-xl font-bold">{lowStock}</h3>
      </div>

      {/* OUT OF STOCK */}
      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Out of Stock</p>
        <h3 className="text-xl font-bold">{outOfStock}</h3>
      </div>

    </div>
  );
}