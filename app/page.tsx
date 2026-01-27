import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";
import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products", {
    cache: "no-store",
  });

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="pt-28">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#FAFAFA] border-b">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">
            Everyday Fashion for Every Family
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the latest trends in men, women, kids and footwear —
            premium quality at honest prices.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/category/men"
              className="px-6 py-3 bg-[#111111] text-white rounded-lg hover:bg-gray-800 transition"
            >
              Shop Men
            </Link>

            <Link
              href="/category/women"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY STRIP ================= */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Men", href: "/category/men" },
            { label: "Women", href: "/category/women" },
            { label: "Kids", href: "/category/kids" },
            { label: "Footwear", href: "/category/footwear" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="border rounded-xl py-8 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-[#111111]">
                {cat.label}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="container mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#111111]">
            New Arrivals
          </h2>

          <Link
            href="/category/men"
            className="text-sm text-[#F5A623] font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-[#FAFAFA] border-t">
        <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Cash on Delivery
            </h3>
            <p className="text-sm text-gray-600">
              Pay only when your order arrives at your doorstep.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Premium Quality
            </h3>
            <p className="text-sm text-gray-600">
              Carefully selected fabrics and trusted brands.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Fast Delivery
            </h3>
            <p className="text-sm text-gray-600">
              Reliable delivery across cities and towns.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
