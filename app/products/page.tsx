import ProductCard from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api";

export const metadata = {
  title: "All Products | RK Fashion House",
};

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="pt-24">
      {/* ================= HEADER ================= */}
      <section className="border-b bg-[#fafafa]">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-[#111111]">
            All Products
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our complete collection — premium quality,
            honest pricing and latest styles.
          </p>
        </div>
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section className="container mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">
              No products available right now.
            </p>
          </div>
        ) : (
          <>
            {/* Result Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b> products
              </p>

              {/* (Future ready) Sort placeholder */}
              <div className="text-sm text-gray-500">
                Sort by: <span className="font-medium">Newest</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ================= FOOTER NOTE ================= */}
      <section className="bg-[#fafafa] border-t">
        <div className="container mx-auto px-6 py-10 text-center">
          <p className="text-sm text-gray-600">
            ✔ Cash on Delivery • ✔ Premium Quality • ✔ Fast Delivery
          </p>
        </div>
      </section>
    </main>
  );
}
