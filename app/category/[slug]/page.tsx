"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = params.slug as string;

  const [type, setType] = useState(searchParams.get("type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const query = new URLSearchParams();

    if (type) query.set("type", type);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (inStock) query.set("inStock", "true");

    setLoading(true);

    fetch(
      `http://localhost:5000/api/products/category/${category}?${query.toString()}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [category, type, minPrice, maxPrice, inStock]);

  // Update URL (without reload)
  const applyFilters = () => {
    const query = new URLSearchParams();

    if (type) query.set("type", type);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (inStock) query.set("inStock", "true");

    router.push(`/category/${category}?${query.toString()}`);
  };

  const clearFilters = () => {
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    router.push(`/category/${category}`);
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-12">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize text-[#111111]">
          {category} Collection
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {products.length} products found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* FILTERS */}
        <aside className="border rounded-xl p-5 h-fit">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>

          {/* PRICE */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-2">Price Range</p>
            <div className="flex gap-2">
              <input
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border px-3 py-2 rounded w-full text-sm"
              />
              <input
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border px-3 py-2 rounded w-full text-sm"
              />
            </div>
          </div>

          {/* STOCK */}
          <label className="flex items-center gap-2 text-sm mb-6">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            In Stock Only
          </label>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={applyFilters}
              className="flex-1 bg-[#111111] text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Apply
            </button>

            <button
              onClick={clearFilters}
              className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </aside>

        {/* PRODUCTS */}
        <section className="lg:col-span-3">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
