import ProductCard from "@/components/ui/product/ProductCard";
import { fetchProductsByCategory } from "@/lib/api";
import { Product } from "@/components/ui/product/product.types";

import CategorySort from "@/components/ui/category/CategorySort";
import BrandFilter from "@/components/ui/category/BrandFilter";
import PriceFilter from "@/components/ui/category/PriceFilter";
import ClearFilters from "@/components/ui/category/ClearFilters";
import StickyActiveFilters from "@/components/ui/category/StickyActiveFilters";

import SubCategoryFilter from "@/components/ui/category/SubCategoryFilter";
import SizeFilter from "@/components/ui/category/SizeFilter";
import ColorFilter from "@/components/ui/category/ColorFilter";
import RatingFilter from "@/components/ui/category/RatingFilter";
import MobileFilterDrawer from "@/components/ui/category/MobileFilterDrawer";

/* ================= TYPES ================= */

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    type?: string;
    sort?: string;
    brand?: string;
    size?: string;
    color?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const { products, filters } =
    await fetchProductsByCategory(slug, sp);

  return (
    <main className="pt-24 bg-white min-h-screen">
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ================= LEFT FILTERS (DESKTOP) ================= */}
          <aside className="hidden lg:block border border-gray-300 hover:border-amber-600 rounded-xl p-6 h-fit sticky top-28">
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
            {/* ===== TOP BAR ===== */}
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

            {/* ===== ACTIVE FILTER CHIPS (STICKY) ===== */}
            <StickyActiveFilters />

            {/* ===== PRODUCT GRID ===== */}
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

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {/* <MobileFilterDrawer
        brands={filters.brands}
        subCategories={filters.subCategories}
        sizes={filters.sizes}
        colors={filters.colors}
        ratings={filters.ratings}
        priceRange={filters.priceRange}
      /> */}
    </main>
  );
}
