"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FavoriteProduct = {
  _id: string;
  title: string;
  price: number;
  image: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  /* ================= LOAD FROM BACKEND ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/wishlist`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to load wishlist");

        const data = await res.json();
        setFavorites(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [BASE_URL]);

  /* ================= REMOVE ================= */
  const removeFavorite = async (productId: string) => {
    try {
      await fetch(
        `${BASE_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setFavorites((prev) =>
        prev.filter((p) => p._id !== productId)
      );
    } catch {
      alert("Failed to remove item");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 animate-pulse">
          Loading your wishlist...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          My Wishlist
        </h1>
        <p className="text-sm text-gray-500">
          {favorites.length} items
        </p>
      </div>

      {/* EMPTY STATE */}
      {favorites.length === 0 && (
        <div className="bg-white border rounded-2xl p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">💔</div>
          <p className="text-lg font-medium mb-2">
            Your wishlist is empty
          </p>
          <p className="text-gray-500 mb-6">
            Save items you love so you can easily find them later.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* GRID */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group relative"
            >

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFavorite(product._id)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-600 px-2 py-1 rounded-full text-xs shadow hover:bg-white"
              >
                ✕
              </button>

              {/* IMAGE */}
              <Link href={`/product/${product._id}`}>
                <div className="h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
              </Link>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <Link href={`/product/${product._id}`}>
                  <p className="font-medium text-sm line-clamp-2 hover:underline">
                    {product.title}
                  </p>
                </Link>

                <p className="font-semibold text-lg">
                  ₹{product.price}
                </p>

                <Link
                  href={`/product/${product._id}`}
                  className="block text-center mt-3 bg-black text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  View Product
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
