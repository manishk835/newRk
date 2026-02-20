"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RatingFilter({
  ratings,
}: {
  ratings: number[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = searchParams.get("rating");

  const select = (r: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set("rating", String(r));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">
        Customer Ratings
      </p>

      <div className="space-y-2 text-sm">
        {ratings.map((r) => (
          <button
            key={r}
            onClick={() => select(r)}
            className={`block ${
              active === String(r)
                ? "font-semibold"
                : ""
            }`}
          >
            ⭐ {r} & above
          </button>
        ))}
      </div>
    </div>
  );
}
