"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FavoriteProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FAVORITES ================= */
  useEffect(() => {
    const stored = localStorage.getItem("rk_favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  /* ================= REMOVE ================= */
  const removeFavorite = (id: string) => {
    const updated = favorites.filter((p) => p.id !== id);
    setFavorites(updated);
    localStorage.setItem("rk_favorites", JSON.stringify(updated));
  };

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Wishlist
      </h1>

      {favorites.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-gray-600 mb-6">
            Your wishlist is empty
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded-xl"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-2xl overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              </div>

              {/* INFO */}
              <div className="p-4">
                <p className="font-medium line-clamp-2 mb-1">
                  {product.title}
                </p>
                <p className="font-semibold mb-3">
                  ₹{product.price}
                </p>

                <div className="flex justify-between items-center">
                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm underline"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
