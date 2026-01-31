"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import { Product } from "@/components/product/product.types";
import { useCart } from "@/app/context/cart/CartContext";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    params.then(async ({ slug }) => {
      try {
        const data = await fetchProductBySlug(slug);
        setProduct(data);
      } catch {
        notFound();
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-600">
        Loading product...
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount =
    product.originalPrice &&
    product.originalPrice > product.price;

  const mainImage =
    product.images?.[0] ||
    product.thumbnail || // backend compatibility
    "/placeholder.png";

  return (
    <main className="pt-28">
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl font-bold mb-3">
              {product.title}
            </h1>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-extrabold">
                ₹{product.price}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {Math.round(
                      ((product.originalPrice! - product.price) /
                        product.originalPrice!) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* STOCK */}
            <p
              className={`text-sm font-medium mb-5 ${
                product.inStock
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.inStock
                ? "✔ In Stock — Ready to ship"
                : "✖ Out of Stock"}
            </p>

            {/* DESCRIPTION */}
            <p className="text-gray-700 leading-relaxed mb-6">
              Premium quality fabric with a comfortable fit.
              Perfect for daily wear as well as festive occasions.
            </p>

            {/* ADD TO CART */}
            <button
              disabled={!product.inStock}
              onClick={() =>
                dispatch({
                  type: "ADD_TO_CART",
                  payload: product,
                })
              }
              className={`px-10 py-4 rounded-xl text-white font-semibold transition ${
                product.inStock
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            {/* TRUST */}
            <div className="mt-8 space-y-2 text-sm text-gray-600">
              <p>✔ Cash on Delivery available</p>
              <p>✔ Quality checked product</p>
              <p>✔ Fast & reliable delivery</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
