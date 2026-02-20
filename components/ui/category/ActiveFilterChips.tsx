"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ActiveFilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(
    searchParams.toString()
  );

  const removeParam = (key: string) => {
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const chips: {
    key: string;
    label: string;
    onRemove: () => void;
  }[] = [];

  // BRAND (multi)
  const brandParam = searchParams.get("brand");
  if (brandParam) {
    brandParam.split(",").forEach((b) => {
      chips.push({
        key: `brand-${b}`,
        label: b,
        onRemove: () => {
          const brands = brandParam
            .split(",")
            .filter((x) => x !== b);

          if (brands.length) {
            params.set("brand", brands.join(","));
          } else {
            params.delete("brand");
          }

          router.push(`?${params.toString()}`);
        },
      });
    });
  }

  // PRICE
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    chips.push({
      key: "price",
      label: `₹${minPrice || "0"}–₹${
        maxPrice || "∞"
      }`,
      onRemove: () => {
        params.delete("minPrice");
        params.delete("maxPrice");
        router.push(`?${params.toString()}`);
      },
    });
  }

  // SORT
  const sort = searchParams.get("sort");
  if (sort) {
    const sortLabel: Record<string, string> = {
      "price-low": "Price ↑",
      "price-high": "Price ↓",
      newest: "Newest",
      az: "A–Z",
    };

    chips.push({
      key: "sort",
      label: sortLabel[sort] || sort,
      onRemove: () => removeParam("sort"),
    });
  }
  // TYPE / SUBCATEGORY (Kurta, Shirt etc)
    const type = searchParams.get("type");
    if (type) {
    chips.push({
        key: "type",
        label: type,
        onRemove: () => {
        params.delete("type");
        router.push(`?${params.toString()}`);
        },
    });
    }


  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="flex items-center gap-1 px-3 py-1 text-xs border rounded-full bg-gray-50 hover:bg-gray-100"
        >
          <span className="capitalize">
            {chip.label}
          </span>
          <span className="text-gray-500">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
