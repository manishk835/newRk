// ======================================================
// 📄 app/(public)/product/[slug]/page.tsx
// ======================================================

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import { Product } from "@/components/ui/product/product.types";
import { useCart } from "@/features/cart/CartContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const router = useRouter();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const isInStock = (product?.totalStock ?? 0) > 0;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductBySlug(slug);
        if (!data) return router.push("/products");

        setProduct(data);
        setActiveImage(
          data.images?.[0]?.url ||
          data.thumbnail ||
          "/placeholder.png"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading)
    return (
      <div className="pt-32 text-center">
        Loading product...
      </div>
    );

  if (!product) return null;

  const discount =
    product.originalPrice &&
      product.originalPrice > product.price
      ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
        100
      )
      : 0;

  return (
    <>
      <main className="pt-24 bg-[#f7f7f7] min-h-screen pb-32">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

          {/* IMAGE GALLERY */}
          <div className="flex gap-4">

            <div className="flex flex-col gap-3">
              {(product.images ?? []).map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-16 h-20 object-cover rounded-md border cursor-pointer transition ${activeImage === img.url
                    ? "border-black"
                    : "border-gray-300"
                    }`}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 border w-full relative shadow-sm">

              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              )}

              <img
                src={activeImage}
                className="w-full aspect-3/4 object-contain"
              />
            </div>
          </div>

          {/* AMAZON STYLE BUY BOX */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">

            <p className="text-sm text-gray-500 mb-1">
              {product.brand}
            </p>

            <h1 className="text-2xl font-semibold leading-snug mb-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold text-black">
                ₹{product.price}
              </span>

              {discount > 0 && (
                <>
                  <span className="line-through text-gray-400 text-lg">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-green-600 font-medium text-sm">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p
              className={`text-sm font-medium mb-5 ${isInStock
                ? "text-green-600"
                : "text-red-600"
                }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* QTY */}
            <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-5">
              <span className="text-sm text-gray-600">
                Quantity
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                  className="w-8 h-8 rounded-full border text-lg"
                >
                  -
                </button>

                <span className="font-medium">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty((q) => q + 1)
                  }
                  className="w-8 h-8 rounded-full border text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              disabled={!isInStock}
              onClick={() => {
                dispatch({
                  type: "ADD_TO_CART",
                  payload: {
                    product,
                    quantity: qty,
                  },
                });
              }}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${isInStock
                ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Add to Cart
            </button>

            <button
              disabled={!isInStock}
              className="w-full mt-3 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-semibold"
            >
              Buy Now
            </button>

            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <p>✔ 7 Days Return</p>
              <p>✔ Secure Payment</p>
              <p>✔ Fast Delivery</p>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="container mx-auto mt-16 bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      </main>

      {/* STICKY BUY BAR */}
      {isInStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between z-50 shadow-lg">
          <span className="font-bold text-lg">
            ₹{product.price}
          </span>
          {/* ADD TO CART */}
          <button
            type="button"
            disabled={!isInStock}
            onClick={() => {
              dispatch({
                type: "ADD_TO_CART",
                payload: {
                  product,
                  quantity: qty,
                },
              });
            }}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${isInStock
                ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Add to Cart
          </button>
        </div>
      )}
    </>
  );
}