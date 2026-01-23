"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/components/product/product.types";
import { useCart } from "@/app/context/cart/CartContext";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

// Dummy products (baad me API/DB se aayega)
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Men Cotton Kurta",
    slug: "men-cotton-kurta",
    price: 899,
    originalPrice: 1299,
    image: "https://via.placeholder.com/600",
    category: "men",
    inStock: true,
  },
  {
    id: "2",
    title: "Women Floral Kurti",
    slug: "women-floral-kurti",
    price: 1099,
    image: "https://via.placeholder.com/600",
    category: "women",
    inStock: true,
  },
];

export default function ProductDetailPage({ params }: PageProps) {
  const { dispatch } = useCart();
  const [slug, setSlug] = useState<string | null>(null);

  // ✅ params Promise unwrap (latest Next.js safe way)
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) return null;

  const product = DUMMY_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-semibold text-gray-900">
              ₹{product.price}
            </span>

            {hasDiscount && (
              <span className="text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* STOCK */}
          <p
            className={`mt-2 text-sm ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* DESCRIPTION */}
          <p className="mt-6 text-gray-700 leading-relaxed">
            High-quality fabric, comfortable fit, suitable for daily
            and festive wear.
          </p>

          {/* ADD TO CART */}
          <button
            disabled={!product.inStock}
            onClick={() =>
              dispatch({ type: "ADD_TO_CART", payload: product })
            }
            className={`mt-6 px-6 py-3 rounded-lg text-white font-medium transition ${
              product.inStock
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
