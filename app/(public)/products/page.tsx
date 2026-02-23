// ======================================================
// 📄 app/(public)/products/page.tsx
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

type ProductsPageProps = {
  searchParams?: Promise<{
    sort?: string;
    brand?: string;
    size?: string;
    color?: string;
    rating?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
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
    "Browse all products at RK Fashion House. Discover premium clothing for men, women and kids.";

  if (sp.brand) {
    title = `${sp.brand} Products | RK Fashion House`;
    description = `Explore premium ${sp.brand} products at RK Fashion House.`;
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

  let products: Product[] = [];
  let filters: any = {
    brands: [],
    subCategories: [],
    sizes: [],
    colors: [],
    ratings: [],
    priceRange: { minPrice: 0, maxPrice: 0 },
  };

  try {
    const data = await fetchAllProducts(sp);
    products = data.products || [];
    filters = data.filters || filters;
  } catch (error) {
    console.error("Products fetch failed:", error);
  }

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <section className="border-b border-gray-200 bg-white">
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
                Showing <b>{products.length}</b> products
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

            {/* PAGINATION PLACEHOLDER */}
            <div className="mt-16 flex justify-center">
              {/* Future: Pagination component */}
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUST NOTE ================= */}
      <section className="bg-white border-t">
        <div className="container mx-auto px-6 py-10 text-center">
          <p className="text-sm text-gray-600">
            ✔ Cash on Delivery • ✔ 7 Days Return • ✔ Fast & Secure Delivery
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
        Try adjusting your filters or explore other categories.
      </p>
    </div>
  );
}

// // app/(public)/products/page.tsx

// import type { Metadata } from "next";
// import ProductCard from "@/components/ui/product/ProductCard";

// import BrandFilter from "@/components/ui/category/BrandFilter";
// import ColorFilter from "@/components/ui/category/ColorFilter";
// import PriceFilter from "@/components/ui/category/PriceFilter";
// import RatingFilter from "@/components/ui/category/RatingFilter";
// import SizeFilter from "@/components/ui/category/SizeFilter";
// import SubCategoryFilter from "@/components/ui/category/SubCategoryFilter";

// import StickyActiveFilters from "@/components/ui/category/StickyActiveFilters";
// import ClearFilters from "@/components/ui/category/ClearFilters";
// import CategorySort from "@/components/ui/category/CategorySort";

// import { fetchAllProducts } from "@/lib/api";
// import type { Product } from "@/components/ui/product/product.types";

// export const revalidate = 60; // ISR

// export const metadata: Metadata = {
//   title: "All Products | RK Fashion House",
//   description:
//     "Browse all products at RK Fashion House. Discover premium clothing for men, women and kids.",
// };

// type ProductsPageProps = {
//   searchParams: {
//     sort?: string;
//     brand?: string;
//     size?: string;
//     color?: string;
//     rating?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     page?: string;
//   };
// };

// export default async function ProductsPage({
//   searchParams,
// }: ProductsPageProps) {

//   let products: Product[] = [];
//   let filters: any = {};

//   try {
//     const data = await fetchAllProducts(searchParams);
//     products = data.products || [];
//     filters = data.filters || {};
//   } catch (error) {
//     console.error("Products fetch failed:", error);
//   }

//   return (
//     <div className="pt-24 bg-gray-50 min-h-screen">

//       {/* ================= HEADER ================= */}
//       <section className="border-b border-gray-200 bg-white">
//         <div className="container mx-auto px-6 py-10">
//           <h1 className="text-3xl font-bold text-gray-900">
//             All Products
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Discover premium fashion — honest pricing, quality you can trust.
//           </p>
//         </div>
//       </section>

//       {/* ================= CONTENT ================= */}
//       <section className="container mx-auto px-6 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

//           {/* ================= FILTERS ================= */}
//           <aside className="hidden lg:block border border-gray-200 rounded-xl p-6 h-fit sticky top-28 bg-white">
//             <h3 className="text-lg font-semibold mb-6">
//               Filters
//             </h3>

//             <SubCategoryFilter subCategories={filters?.subCategories || []} />
//             <SizeFilter sizes={filters?.sizes || []} />
//             <ColorFilter colors={filters?.colors || []} />
//             <BrandFilter brands={filters?.brands || []} />
//             <RatingFilter ratings={filters?.ratings || []} />
//             <PriceFilter priceRange={filters?.priceRange || {}} />
//           </aside>

//           {/* ================= PRODUCTS ================= */}
//           <div className="lg:col-span-3">

//             {/* TOP BAR */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//               <p className="text-sm text-gray-600">
//                 Showing <b>{products.length}</b> products
//               </p>

//               <div className="flex items-center gap-4">
//                 <ClearFilters />
//                 <CategorySort />
//               </div>
//             </div>

//             {/* ACTIVE FILTERS */}
//             <StickyActiveFilters />

//             {/* GRID */}
//             {products.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {products.map((p) => (
//                   <ProductCard
//                     key={p._id}
//                     product={p}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* PAGINATION PLACEHOLDER (IMPORTANT FOR SCALE) */}
//             <div className="mt-16 flex justify-center">
//               {/* Later: Pagination component */}
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= TRUST NOTE ================= */}
//       <section className="bg-white border-t">
//         <div className="container mx-auto px-6 py-10 text-center">
//           <p className="text-sm text-gray-600">
//             ✔ Cash on Delivery • ✔ 7 Days Return • ✔ Fast & Secure Delivery
//           </p>
//         </div>
//       </section>

//     </div>
//   );
// }

// /* ====================================================== */

// function EmptyState() {
//   return (
//     <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
//       <h3 className="text-xl font-semibold mb-2">
//         No products found
//       </h3>
//       <p className="text-gray-600 mb-6">
//         Try adjusting your filters or explore other categories.
//       </p>
//     </div>
//   );
// }


// // app/(public)/products/page.tsx

// import ProductCard from "@/components/ui/product/ProductCard";
// import BrandFilter from "@/components/ui/category/BrandFilter";
// import ColorFilter from "@/components/ui/category/ColorFilter";
// import PriceFilter from "@/components/ui/category/PriceFilter";
// import RatingFilter from "@/components/ui/category/RatingFilter";
// import SizeFilter from "@/components/ui/category/SizeFilter";
// import SubCategoryFilter from "@/components/ui/category/SubCategoryFilter";
// import StickyActiveFilters from "@/components/ui/category/StickyActiveFilters";
// import ClearFilters from "@/components/ui/category/ClearFilters";
// import CategorySort from "@/components/ui/category/CategorySort";

// import { fetchAllProducts } from "@/lib/api";
// import { Product } from "@/components/ui/product/product.types";

// export const metadata = {
//   title: "All Products | RK Fashion",
// };

// type ProductsPageProps = {
//   searchParams?: Promise<{
//     sort?: string;
//     brand?: string;
//     size?: string;
//     color?: string;
//     rating?: string;
//     minPrice?: string;
//     maxPrice?: string;
//   }>;
// };

// export default async function ProductsPage({
//   searchParams,
// }: ProductsPageProps) {
//   const sp = await searchParams;

//   const { products, filters } =
//     await fetchAllProducts(sp);

//   return (
//     <main className="pt-24 bg-gray-50 min-h-screen">
//       {/* ================= HEADER ================= */}
//       <section className="border-b border-[#F5A623] bg-white">
//         <div className="container mx-auto px-6 py-10">
//           <h1 className="text-3xl font-bold text-gray-900">
//             All Products
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Discover premium fashion — honest pricing, quality you can trust.
//           </p>
//         </div>
//       </section>

//       {/* ================= CONTENT ================= */}
//       <section className="container mx-auto px-6 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
//           {/* ================= FILTERS ================= */}
//           <aside className="hidden lg:block border border-gray-300 rounded-xl p-6 h-fit sticky top-28 bg-white">
//             <h3 className="text-lg font-semibold mb-6">
//               Filters
//             </h3>

//             <SubCategoryFilter
//               subCategories={filters.subCategories}
//             />

//             <SizeFilter sizes={filters.sizes} />

//             <ColorFilter colors={filters.colors} />

//             <BrandFilter brands={filters.brands} />

//             <RatingFilter ratings={filters.ratings} />

//             <PriceFilter
//               priceRange={filters.priceRange}
//             />
//           </aside>

//           {/* ================= PRODUCTS ================= */}
//           <div className="lg:col-span-3">
//             {/* TOP BAR */}
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-sm text-gray-600">
//                 Showing <b>{products.length}</b>{" "}
//                 products
//               </p>

//               <div className="flex items-center gap-4">
//                 <ClearFilters />
//                 <CategorySort />
//               </div>
//             </div>

//             {/* ACTIVE FILTERS */}
//             <StickyActiveFilters />

//             {/* GRID */}
//             {products.length === 0 ? (
//               <p className="text-gray-600">
//                 No products found
//               </p>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {products.map((p: Product) => (
//                   <ProductCard
//                     key={p._id}
//                     product={p}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ================= FOOTER NOTE ================= */}
//       <section className="bg-white border-t">
//         <div className="container mx-auto px-6 py-10 text-center">
//           <p className="text-sm text-gray-600">
//             ✔ Cash on Delivery • ✔ 7 Days Return • ✔ Fast & Secure Delivery
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }

