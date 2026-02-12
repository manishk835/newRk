// app/product/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { Product } from "@/components/product/product.types";
import { useCart } from "@/app/context/cart/CartContext";
import ProductCard from "@/components/product/ProductCard";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [zoom, setZoom] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ slug }) => {
      try {
        const data = await fetchProductBySlug(slug);
        setProduct(data);
        setActiveImage(
          data.images?.[0]?.url || data.thumbnail || "/placeholder.png"
        );



        // related products (simple logic)
        const all = await fetchProducts();
        setRelated(all.filter(p => p.slug !== slug).slice(0, 8));
      } catch {
        notFound();
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Loading product…
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount =
    product.originalPrice &&
    product.originalPrice > product.price;

  return (
    <>
      <main className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 pb-32">

          {/* ================= MAIN ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

            {/* IMAGES */}
            <div>
              <div
                onClick={() => setZoom(true)}
                className="bg-gray-100 rounded-2xl overflow-hidden mb-4 cursor-zoom-in"
              >
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full aspect-3/4 object-contain"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={img.url || index}
                      onClick={() => setActiveImage(img.url)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border overflow-hidden shrink-0 ${activeImage === img.url
                          ? "border-black"
                          : "border-gray-200"
                        }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* DETAILS */}
            <div>
              {product.brand && (
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  {product.brand}
                </p>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                {product.title}
              </h1>

              {(product.rating ?? 0) > 0 && (
                <p>
                  ⭐ {product.rating ?? 0} · {product.reviewsCount ?? 0} reviews
                </p>
              )}



              <div className="flex items-end gap-4 mb-4">
                <span className="text-3xl font-extrabold">
                  ₹{product.price}
                </span>

                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <p
                className={`text-sm font-medium mb-6 ${product.inStock
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {product.inStock
                  ? "In stock · Ready to ship"
                  : "Out of stock"}
              </p>

              {/* {product.highlights?.length > 0 && (
                <ul className="space-y-2 text-sm text-gray-700 mb-8">
                  {product.highlights.map(p => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              )} */}

              <button
                onClick={() =>
                  dispatch({ type: "ADD_TO_CART", payload: product })
                }
                disabled={!product.inStock}
                className={`w-full sm:w-auto px-10 py-4 rounded-xl text-white font-semibold ${product.inStock
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400"
                  }`}
              >
                Add to Cart
              </button>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>✔ Cash on Delivery</p>
                <p>✔ Quality checked</p>
                <p>✔ Fast delivery</p>
                <p>✔ Easy returns</p>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-20 max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">
                Product Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* REVIEWS (UI READY) */}
          <div className="mt-20 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              Customer Reviews
            </h2>
            <p className="text-gray-500 text-sm">
              ⭐⭐⭐⭐☆ 4.3 average rating
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Reviews feature coming soon.
            </p>
          </div>

          {/* RELATED PRODUCTS */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl font-bold mb-8">
                You may also like
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-4">
                {related.map(p => (
                  <div key={p._id} className="w-56 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= STICKY ADD TO CART (MOBILE) ================= */}
      {product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between sm:hidden z-50">
          <span className="font-bold">₹{product.price}</span>
          <button
            onClick={() =>
              dispatch({ type: "ADD_TO_CART", payload: product })
            }
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* ================= IMAGE ZOOM ================= */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <img
            src={activeImage}
            alt=""
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </>
  );
}