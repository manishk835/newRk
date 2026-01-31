// import ProductCard from "@/components/product/ProductCard";
// // import CategoryFilters from "@/components/category/CategoryFilters";
// import { fetchProductsByCategory } from "@/lib/api";
// import { Product } from "@/components/product/product.types";
// import CategoryFilters from "@/components/category/CategoryFilters";

// /* ================= SEO ================= */

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   const categoryName =
//     slug.charAt(0).toUpperCase() + slug.slice(1);

//   return {
//     title: `${categoryName} Collection | RK Fashion`,
//     description: `Shop latest ${categoryName} products at RK Fashion`,
//   };
// }

// /* ================= PAGE ================= */

// export default async function CategoryPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ slug: string }>;
//   searchParams?: Promise<{ sort?: string }>;
// }) {
//   const { slug } = await params;
//   const resolvedSearchParams = await searchParams;
//   const sort = resolvedSearchParams?.sort ?? "";

//   let products: Product[] = [];

//   try {
//     products = await fetchProductsByCategory(slug, {
//       sort: sort || undefined,
//     });
//   } catch {
//     products = [];
//   }

//   return (
//     <main className="pt-24 bg-white min-h-screen">
//       {/* ================= HEADER ================= */}
//       <section className="border-b bg-[#fafafa]">
//         <div className="container mx-auto px-6 py-8">
//           <p className="text-sm text-gray-500 mb-1">
//             Home / {slug}
//           </p>

//           <h1 className="text-3xl font-bold capitalize">
//             {slug} – {products.length} items
//           </h1>
//         </div>
//       </section>

//       {/* ================= CONTENT ================= */}
//       <section className="container mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          
//           {/* LEFT FILTERS */}
//           <aside className="hidden lg:block">
//             <CategoryFilters />
//           </aside>

//           {/* RIGHT PRODUCTS */}
//           <div>
//             {/* Sorting */}
//             <div className="flex justify-between items-center mb-8">
//               <p className="text-sm text-gray-600">
//                 Showing {products.length} products
//               </p>

//               <select
//                 defaultValue={sort}
//                 className="border px-3 py-2 text-sm rounded-md"
//               >
//                 <option value="">Select Sorting Options</option>
//                 <option value="az">A to Z</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="newest">Newest</option>
//                 <option value="popular">Popularity</option>
//               </select>
//             </div>

//             {/* PRODUCTS GRID */}
//             {products.length === 0 ? (
//               <div className="py-20 text-center">
//                 <p className="font-semibold text-lg">
//                   No products found
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
//                 {/* PROMO CARD */}
//                 {/* <div className="col-span-2 bg-gray-100 rounded-lg overflow-hidden hidden md:block">
//                   <img
//                     src="/banners/cotton-linen.jpg"
//                     alt="Cotton Linen Shirts"
//                     className="w-full h-full object-cover"
//                   />
//                 </div> */}

//                 {products.map((product) => (
//                   <ProductCard
//                     key={product._id}
//                     product={product}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


import ProductCard from "@/components/product/ProductCard";
import { fetchProductsByCategory } from "@/lib/api";
import { Product } from "@/components/product/product.types";

/* ================= TYPES ================= */

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    type?: string;
  }>;
};

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} Collection | RK Fashion`,
    description: `Shop latest ${categoryName} products at RK Fashion`,
  };
}

/* ================= PAGE ================= */

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params; // ✅ unwrap params
  const resolvedSearchParams = await searchParams; // ✅ unwrap searchParams
  const type = resolvedSearchParams?.type ?? "";

  let products: Product[] = [];

  try {
    products = await fetchProductsByCategory(slug, {
      type: type || undefined,
    });
  } catch {
    products = [];
  }

  const heading = type
    ? `${slug} / ${type}`
    : slug;

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="bg-[#fafafa] border-b">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold capitalize text-[#111111]">
            {heading}
          </h1>

          <p className="text-gray-600 mt-2 max-w-xl">
            Browse our latest collection curated for comfort,
            style and everyday wear.
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="container mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold mb-2">
              No products found
            </p>
            <p className="text-gray-600">
              New items will be added very soon.
            </p>
          </div>
        ) : (
          <>
            {/* Count + Filter */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b> products
              </p>

              <p className="text-sm text-gray-500">
                Filter:{" "}
                <span className="font-medium capitalize">
                  {type || "All"}
                </span>
              </p>
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
