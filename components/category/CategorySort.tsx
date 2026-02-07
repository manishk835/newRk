"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "newest", label: "What's New" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function CategorySort() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("sort") || "";

  const currentLabel =
    OPTIONS.find((o) => o.value === current)
      ?.label || "Sort";

  const applySort = (value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    value
      ? params.set("sort", value)
      : params.delete("sort");

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between gap-3
          min-w-47.5
          rounded border border-gray-300
          bg-white px-5 py-2.5 text-sm
          hover:border-amber-600 transition
        "
      >
        <span className="text-gray-800 font-medium">
          {currentLabel}
        </span>
        <span
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <>
          {/* click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              absolute right-0 mt-3 z-50 w-60
              rounded-2xl border border-gray-300 hover:border-amber-600 bg-white
              shadow-[0_10px_30px_rgba(0,0,0,0.08)]
              overflow-hidden
              animate-dropdown
            "
          >
            {OPTIONS.map((opt) => {
              const active =
                opt.value === current;

              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    applySort(opt.value)
                  }
                  className={`
                    w-full flex items-center justify-between
                    px-5 py-3 text-sm
                    transition
                    ${
                      active
                        ? "bg-gray-100 font-semibold text-black"
                        : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {active && (
                    <span className="text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
