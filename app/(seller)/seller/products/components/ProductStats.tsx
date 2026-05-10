"use client";

import { Product } from "../types/product";

/* ================= TYPES ================= */

type Props = {
  products: Product[];
};

/* ================= COMPONENT ================= */

export default function ProductStats({
  products,
}: Props) {

  /* ================= CALCULATIONS ================= */

  const total =
    products.length;

  const getStock = (
    p: Product
  ) =>
    p.variants?.reduce(
      (acc, v) =>
        acc +
        (v.stock || 0),
      0
    ) || 0;

  const lowStock =
    products.filter(
      (p) =>
        getStock(p) <= 5
    ).length;

  const active =
    products.filter(
      (p) =>
        p.isApproved &&
        p.isActive !== false
    ).length;

  const outOfStock =
    products.filter(
      (p) =>
        getStock(p) === 0
    ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {/* TOTAL */}
      <StatCard
        title="Total Products"
        value={total}
        icon="📦"
      />

      {/* ACTIVE */}
      <StatCard
        title="Active"
        value={active}
        icon="✅"
        valueColor="text-green-600"
      />

      {/* LOW STOCK */}
      <StatCard
        title="Low Stock"
        value={lowStock}
        icon="⚠️"
        valueColor="text-yellow-600"
      />

      {/* OUT OF STOCK */}
      <StatCard
        title="Out of Stock"
        value={outOfStock}
        icon="❌"
        valueColor="text-red-600"
      />

    </div>
  );
}

/* ================= CARD ================= */

type CardProps = {
  title: string;

  value: number;

  icon: string;

  valueColor?: string;
};

function StatCard({
  title,
  value,
  icon,
  valueColor,
}: CardProps) {

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

      <div className="flex items-center justify-between mb-3">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      <h3
        className={`text-2xl font-bold ${
          valueColor ||
          "text-black dark:text-white"
        }`}
      >
        {value}
      </h3>

    </div>
  );
}