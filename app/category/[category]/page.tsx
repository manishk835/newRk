"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const category = params.category as string;

  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();

    if (type) query.append("type", type);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (inStock) query.append("inStock", inStock);

    fetch(
      `http://localhost:5000/api/products/category/${category}?${query.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, [category, type, minPrice, maxPrice, inStock]);

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} Collection
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Filters</h2>

          {/* PRICE */}
          <div>
            <p className="text-sm mb-1">Price</p>
            <input
              placeholder="Min"
              className="border px-2 py-1 w-full mb-2"
              value={minPrice}
              onChange={(e) =>
                window.location.search =
                  `?minPrice=${e.target.value}&maxPrice=${maxPrice}`
              }
            />
            <input
              placeholder="Max"
              className="border px-2 py-1 w-full"
              value={maxPrice}
              onChange={(e) =>
                window.location.search =
                  `?minPrice=${minPrice}&maxPrice=${e.target.value}`
              }
            />
          </div>

          {/* STOCK */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock === "true"}
              onChange={(e) =>
                window.location.search =
                  e.target.checked
                    ? "?inStock=true"
                    : ""
              }
            />
            In Stock Only
          </label>
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
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
        </div>
      </div>
    </div>
  );
}
