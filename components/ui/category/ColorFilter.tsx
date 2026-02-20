"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ColorFilter({
  colors,
}: {
  colors: { _id: string; count: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    searchParams.get("color")?.split(",") || [];

  const toggle = (color: string) => {
    let updated = [...selected];
    updated.includes(color)
      ? (updated = updated.filter((c) => c !== color))
      : updated.push(color);

    const params = new URLSearchParams(
      searchParams.toString()
    );
    updated.length
      ? params.set("color", updated.join(","))
      : params.delete("color");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">Color</p>

      <div className="flex flex-wrap gap-3">
        {colors.map((c) => {
          const active = selected.includes(c._id);
          return (
            <button
              key={c._id}
              onClick={() => toggle(c._id)}
              title={c._id}
              className={`w-7 h-7 rounded-full border-2 ${
                active
                  ? "border-black"
                  : "border-gray-300"
              }`}
              style={{
                backgroundColor: c._id,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
