"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SubCategoryFilter({
  subCategories,
}: {
  subCategories: { _id: string; count: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAll, setShowAll] = useState(false);

  const selected =
    searchParams.get("type")?.split(",") || [];

  const toggle = (val: string) => {
    let updated = [...selected];
    updated.includes(val)
      ? (updated = updated.filter((x) => x !== val))
      : updated.push(val);

    const params = new URLSearchParams(
      searchParams.toString()
    );
    updated.length
      ? params.set("type", updated.join(","))
      : params.delete("type");

    router.push(`?${params.toString()}`);
  };

  const list = showAll
    ? subCategories
    : subCategories.slice(0, 5);

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">Category</p>

      <div className="space-y-2 text-sm max-h-48 overflow-auto">
        {list.map((c) => (
          <label
            key={c._id}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selected.includes(c._id)}
              onChange={() => toggle(c._id)}
            />
            <span className="capitalize">
              {c._id}
            </span>
            <span className="text-gray-400">
              ({c.count})
            </span>
          </label>
        ))}
      </div>

      {subCategories.length > 5 && (
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
