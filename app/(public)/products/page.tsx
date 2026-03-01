// ======================================================
// 📄 app/(public)/products/page.tsx
// Production SaaS Version
// ======================================================

import type { Metadata } from "next";
import ProductCard from "@/components/ui/product/ProductCard";

import BrandFilter from "@/components/ui/category/BrandFilter";
import ColorFilter from "@/components/ui/category/ColorFilter";
import PriceFilter from "@/components/ui/category/PriceFilter";
import RatingFilter from "@/components/ui/category/RatingFilter";
import SizeFilter from "@/components/ui/category/SizeFilter";
import SubCategoryFilter from "@/components/ui/category/SubCategoryFilter";

import StickyActiveFilters from "@/components/ui/category/StickyActiveFilters";
import ClearFilters from "@/components/ui/category/ClearFilters";
import CategorySort from "@/components/ui/category/CategorySort";

import { fetchAllProducts } from "@/lib/api";
import type { Product } from "@/components/ui/product/product.types";

export const revalidate = 60;

/* ======================================================
   TYPES
====================================================== */

type SearchParams = {
  sort?: string;
  brand?: string;
  size?: string;
  color?: string;
  rating?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  filter?: string; // featured | new | best
};

type ProductsPageProps = {
  searchParams?: Promise<SearchParams>;
};

/* ======================================================
   DYNAMIC SEO
====================================================== */

export async function generateMetadata(
  { searchParams }: ProductsPageProps
): Promise<Metadata> {

  const sp = (await searchParams) || {};

  let title = "All Products | RK Fashion House";
  let description =
    "Browse premium fashion for men, women and kids at RK Fashion House.";

  if (sp.filter === "featured") {
    title = "Featured Products | RK Fashion House";
  }

  if (sp.filter === "new") {
    title = "New Arrivals | RK Fashion House";
  }

  if (sp.filter === "best") {
    title = "Best Sellers | RK Fashion House";
  }

  if (sp.brand) {
    title = `${sp.brand} Products | RK Fashion House`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

/* ======================================================
   PAGE
====================================================== */

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {

  const sp = (await searchParams) || {};

  const currentPage = Number(sp.page) || 1;

  let products: Product[] = [];
  let total = 0;

  let filters: any = {
    brands: [],
    subCategories: [],
    sizes: [],
    colors: [],
    ratings: [],
    priceRange: { minPrice: 0, maxPrice: 0 },
  };

  try {
    const data = await fetchAllProducts({
      ...sp,
      page: sp.page || "1",
    });    products = data.products || [];
    filters = data.filters || filters;
    total = data.total || products.length;
  } catch (error) {
    console.error("Products fetch failed:", error);
  }

  /* ================= PAGE TITLE ================= */

  let pageTitle = "All Products";

  if (sp.filter === "featured") pageTitle = "Featured Products";
  if (sp.filter === "new") pageTitle = "New Arrivals";
  if (sp.filter === "best") pageTitle = "Best Sellers";
  if (sp.brand) pageTitle = `${sp.brand} Products`;

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <p className="text-gray-600 mt-2">
            Showing curated results tailored to your selection.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ================= FILTERS ================= */}
          <aside className="hidden lg:block border border-gray-200 rounded-xl p-6 h-fit sticky top-28 bg-white">
            <h3 className="text-lg font-semibold mb-6">
              Filters
            </h3>

            <SubCategoryFilter subCategories={filters.subCategories} />
            <SizeFilter sizes={filters.sizes} />
            <ColorFilter colors={filters.colors} />
            <BrandFilter brands={filters.brands} />
            <RatingFilter ratings={filters.ratings} />
            <PriceFilter priceRange={filters.priceRange} />
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="lg:col-span-3">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b> of <b>{total}</b> products
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
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                  />
                ))}
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {total > 12 && (
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                perPage={12}
              />
            )}

          </div>
        </div>
      </section>

      {/* ================= TRUST NOTE ================= */}
      <section className="bg-white border-t">
        <div className="container mx-auto px-6 py-10 text-center">
          <p className="text-sm text-gray-600">
            ✔ Secure Checkout • ✔ 7 Days Return • ✔ Verified Sellers
          </p>
        </div>
      </section>

    </div>
  );
}

/* ====================================================== */

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        Try adjusting filters or explore other collections.
      </p>
    </div>
  );
}

/* ====================================================== */
/* PAGINATION COMPONENT */
/* ====================================================== */

function Pagination({
  currentPage,
  totalItems,
  perPage,
}: {
  currentPage: number;
  totalItems: number;
  perPage: number;
}) {

  const totalPages = Math.ceil(totalItems / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex justify-center gap-3">
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;

        return (
          <a
            key={page}
            href={`?page=${page}`}
            className={`px-4 py-2 rounded-lg border text-sm ${
              currentPage === page
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </a>
        );
      })}
    </div>
  );
}
