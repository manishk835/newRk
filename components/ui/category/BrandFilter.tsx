"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function BrandFilter({
  brands,
}: {
  brands: { _id: string; count: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAll, setShowAll] = useState(false);

  const selected =
    searchParams.get("brand")?.split(",") || [];

  const toggle = (val: string) => {
    let updated = [...selected];
    updated.includes(val)
      ? (updated = updated.filter((x) => x !== val))
      : updated.push(val);

    const params = new URLSearchParams(
      searchParams.toString()
    );
    updated.length
      ? params.set("brand", updated.join(","))
      : params.delete("brand");

    router.push(`?${params.toString()}`);
  };

  const list = showAll
    ? brands
    : brands.slice(0, 5);

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">Brand</p>

      <div className="space-y-2 text-sm max-h-48 overflow-auto">
        {list.map((b) => (
          <label
            key={b._id}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selected.includes(b._id)}
              onChange={() => toggle(b._id)}
            />
            <span className="capitalize">
              {b._id}
            </span>
            <span className="text-gray-400">
              ({b.count})
            </span>
          </label>
        ))}
      </div>

      {brands.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs mt-2 text-blue-600"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
