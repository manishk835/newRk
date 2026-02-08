// app/products/page.tsx

import ProductCard from "@/components/product/ProductCard";
import BrandFilter from "@/components/category/BrandFilter";
import ColorFilter from "@/components/category/ColorFilter";
import PriceFilter from "@/components/category/PriceFilter";
import RatingFilter from "@/components/category/RatingFilter";
import SizeFilter from "@/components/category/SizeFilter";
import SubCategoryFilter from "@/components/category/SubCategoryFilter";
import StickyActiveFilters from "@/components/category/StickyActiveFilters";
import ClearFilters from "@/components/category/ClearFilters";
import CategorySort from "@/components/category/CategorySort";

import { fetchAllProducts } from "@/lib/api";
import { Product } from "@/components/product/product.types";

export const metadata = {
  title: "All Products | RK Fashion",
};

type ProductsPageProps = {
  searchParams?: Promise<{
    sort?: string;
    brand?: string;
    size?: string;
    color?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sp = await searchParams;

  const { products, filters } =
    await fetchAllProducts(sp);

  return (
    <main className="pt-24 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="border-b border-[#F5A623] bg-white">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="text-gray-600 mt-2">
            Discover premium fashion — honest pricing, quality you can trust.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ================= FILTERS ================= */}
          <aside className="hidden lg:block border border-gray-300 rounded-xl p-6 h-fit sticky top-28 bg-white">
            <h3 className="text-lg font-semibold mb-6">
              Filters
            </h3>

            <SubCategoryFilter
              subCategories={filters.subCategories}
            />

            <SizeFilter sizes={filters.sizes} />

            <ColorFilter colors={filters.colors} />

            <BrandFilter brands={filters.brands} />

            <RatingFilter ratings={filters.ratings} />

            <PriceFilter
              priceRange={filters.priceRange}
            />
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="lg:col-span-3">
            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b>{" "}
                products
              </p>

              <div className="flex items-center gap-4">
                <ClearFilters />
                <CategorySort />
              </div>
            </div>

            {/* ACTIVE FILTERS */}
            <StickyActiveFilters />

            {/* GRID */}
            {products.length === 0 ? (
              <p className="text-gray-600">
                No products found
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p: Product) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER NOTE ================= */}
      <section className="bg-white border-t">
        <div className="container mx-auto px-6 py-10 text-center">
          <p className="text-sm text-gray-600">
            ✔ Cash on Delivery • ✔ 7 Days Return • ✔ Fast & Secure Delivery
          </p>
        </div>
      </section>
    </main>
  );
}

