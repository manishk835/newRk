"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import { Product } from "@/components/ui/product/product.types";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    searchProducts(debouncedQuery)
      .then((res) => {
        setResults(res.slice(0, 6));
        setOpen(true);
      })
      .catch(() => setResults([]));
  }, [debouncedQuery]);

  const goToSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        onKeyDown={(e) =>
          e.key === "Enter" && goToSearch()
        }
        placeholder="Search products, brands..."
        className="
          w-full rounded-full border border-gray-300
          px-5 py-2.5 text-sm
          focus:outline-none focus:border-[#F5A623]
        "
      />

      {/* DROPDOWN */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50">
          {results.map((p) => (
            <button
              key={p._id}
              onClick={() =>
                router.push(`/product/${p.slug}`)
              }
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium line-clamp-1">
                  {p.title}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{p.price}
                </p>
              </div>
            </button>
          ))}

          <button
            onClick={goToSearch}
            className="block w-full text-center py-2 text-sm text-blue-600 hover:bg-gray-50"
          >
            View all results →
          </button>
        </div>
      )}
    </div>
  );
}
