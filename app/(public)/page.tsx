// app/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import ProductCard from "@/components/ui/product/ProductCard";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/components/ui/product/product.types";
import WishlistButton from "@/components/ui/WishlistButton";

export const metadata: Metadata = {
  title: "RK Fashion House | Everyday Fashion for Every Family",
  description:
    "Premium quality clothing for men, women and kids. Fast delivery. Cash on Delivery available.",
};

export default async function HomePage() {

  let products: Product[] = [];  // ✅ FIXED TYPE

  try {
    products = await fetchProducts();
  } catch (err) {
    console.error("Homepage product fetch failed:", err);
  }

  const featured = products
    .filter((p) => p?.isFeatured === true)
    .slice(0, 8);

  const newArrivals = products
    .filter((p) => p?.isNewArrival === true)
    .slice(0, 8);

  const bestSellers = products
    .filter((p) => p?.isBestSeller === true)
    .slice(0, 8);

  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="pt-28 md:pt-36 pb-20 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Everyday Fashion <br /> For Every Family
            </h1>

            <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
              Premium quality clothing for men, women & kids.
              Honest pricing. Fast delivery. Cash on Delivery.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/men"
                className="px-10 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Shop Men
              </Link>

              <Link
                href="/category/women"
                className="px-10 py-4 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
              >
                Shop Women
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="h-96 rounded-3xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              Hero Image
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {[
              { title: "Cash on Delivery", icon: "💰" },
              { title: "Premium Quality", icon: "⭐" },
              { title: "Fast Shipping", icon: "🚚" },
              { title: "Easy Returns", icon: "↩️" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featured?.length > 0 && (
        <ProductSection
          title="Featured Products"
          products={featured}
          bg="bg-gray-50"
        />
      )}

      {/* ================= NEW ARRIVALS ================= */}
      {newArrivals?.length > 0 && (
        <ProductSection
          title="New Arrivals"
          products={newArrivals}
        />
      )}

      {/* ================= BEST SELLERS ================= */}
      {bestSellers?.length > 0 && (
        <ProductSection
          title="Best Sellers"
          products={bestSellers}
          bg="bg-gray-50"
        />
      )}

      {/* ================= CTA ================= */}
      <section className="py-28 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Fashion that fits your lifestyle
          </h2>

          <p className="text-gray-300 mb-10">
            Comfortable. Stylish. Affordable.
          </p>

          <Link
            href="/products"
            className="inline-block px-12 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Collection
          </Link>
        </div>
      </section>

    </main>
  );
}

/* ======================================================
   REUSABLE PRODUCT SECTION (Scalable)
====================================================== */

function ProductSection({
  title,
  products,
  bg,
}: {
  title: string;
  products: any[];
  bg?: string;
}) {
  return (
    <section className={`py-20 ${bg || ""}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{title}</h2>

          <Link
            href="/products"
            className="text-sm font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl =
              product.thumbnail ||
              product.images?.[0]?.url ||
              product.image ||
              "/placeholder.png";

            return (
              <div key={product._id} className="relative group">

                {/* Wishlist */}
                <div className="absolute top-3 right-3 z-10">
                  <WishlistButton productId={product._id} />
                </div>

                {/* CLICKABLE CARD */}
                <Link
                  href={`/product/${product.slug}`}
                  className="block bg-white rounded-xl border p-4 
                     hover:shadow-md transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* INFO */}
                  <h2 className="mt-3 font-medium line-clamp-2">
                    {product.title}
                  </h2>

                  <p className="font-semibold mt-1">
                    ₹{product.price}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
