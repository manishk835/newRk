"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterCountItem } from "@/lib/api";

type FiltersProps = {
  brands: FilterCountItem[];
  subCategories: FilterCountItem[];
  sizes: FilterCountItem[];
  colors: FilterCountItem[];
  ratings: number[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};

export default function MobileFilterDrawer({
  brands,
  subCategories,
  sizes,
  colors,
  ratings,
  priceRange,
}: FiltersProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleMulti = (key: string, value: string) => {
    const selected =
      searchParams.get(key)?.split(",") || [];

    let updated = [...selected];
    updated.includes(value)
      ? (updated = updated.filter((v) => v !== value))
      : updated.push(value);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    updated.length
      ? params.set(key, updated.join(","))
      : params.delete(key);

    router.push(`?${params.toString()}`);
  };

  const setSingle = (key: string, value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(window.location.pathname);
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-black text-white py-3 rounded-lg"
      >
        Filters
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl p-6 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Filters
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-sm"
          >
            Close
          </button>
        </div>

        {/* SUB CATEGORY */}
        <Section title="Category">
          {subCategories.map((c) => (
            <Check
              key={c._id}
              label={c._id}
              count={c.count}
              onClick={() =>
                toggleMulti("type", c._id)
              }
            />
          ))}
        </Section>

        {/* SIZE */}
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Chip
                key={s._id}
                label={s._id}
                onClick={() =>
                  toggleMulti("size", s._id)
                }
              />
            ))}
          </div>
        </Section>

        {/* COLOR */}
        <Section title="Color">
          <div className="flex gap-3 flex-wrap">
            {colors.map((c) => (
              <button
                key={c._id}
                onClick={() =>
                  toggleMulti("color", c._id)
                }
                className="w-7 h-7 rounded-full border"
                style={{
                  backgroundColor: c._id,
                }}
              />
            ))}
          </div>
        </Section>

        {/* BRAND */}
        <Section title="Brand">
          {brands.map((b) => (
            <Check
              key={b._id}
              label={b._id}
              count={b.count}
              onClick={() =>
                toggleMulti("brand", b._id)
              }
            />
          ))}
        </Section>

        {/* RATING */}
        <Section title="Customer Rating">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() =>
                setSingle("rating", String(r))
              }
              className="block text-sm"
            >
              ⭐ {r} & above
            </button>
          ))}
        </Section>

        {/* CLEAR */}
        <button
          onClick={clearAll}
          className="w-full border py-2 rounded mt-4"
        >
          Clear all filters
        </button>
      </div>
    </>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="font-medium mb-3">{title}</p>
      {children}
    </div>
  );
}

function Check({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <label
      className="flex items-center gap-2 text-sm cursor-pointer"
      onClick={onClick}
    >
      <input type="checkbox" readOnly />
      <span className="capitalize">{label}</span>
      <span className="text-gray-400">
        ({count})
      </span>
    </label>
  );
}

function Chip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs border rounded"
    >
      {label}
    </button>
  );
}
