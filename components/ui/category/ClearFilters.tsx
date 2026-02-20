"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ClearFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.has("brand") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("type") ||
    searchParams.has("sort");

  if (!hasFilters) return null;

  const clearAll = () => {
    router.push(window.location.pathname);
  };

  return (
    <button
      onClick={clearAll}
      className="text-sm text-red-600 hover:underline"
    >
      Clear all
    </button>
  );
}
