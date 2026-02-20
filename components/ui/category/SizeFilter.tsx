"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SizeFilter({
  sizes,
}: {
  sizes: { _id: string; count: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    searchParams.get("size")?.split(",") || [];

  const toggle = (val: string) => {
    let updated = [...selected];
    updated.includes(val)
      ? (updated = updated.filter((x) => x !== val))
      : updated.push(val);

    const params = new URLSearchParams(
      searchParams.toString()
    );
    updated.length
      ? params.set("size", updated.join(","))
      : params.delete("size");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">Size</p>

      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const active = selected.includes(s._id);
          return (
            <button
              key={s._id}
              onClick={() => toggle(s._id)}
              className={`px-3 py-1 text-xs border rounded
              ${
                active
                  ? "bg-black text-white"
                  : "hover:border-black"
              }`}
            >
              {s._id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
