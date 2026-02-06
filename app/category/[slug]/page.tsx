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
    description: `Shop latest ${categoryName} products at RK Fashion. Premium quality, best price, fast delivery.`,
  };
}

/* ================= PAGE ================= */

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const type = resolvedSearchParams?.type ?? "";

  let products: Product[] = [];

  try {
    products = await fetchProductsByCategory(slug, {
      type: type || undefined,
    });
  } catch {
    products = [];
  }

  const heading = type ? `${slug} / ${type}` : slug;

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* ================= HERO HEADER ================= */}
      <section className="bg-linear-to-b from-[#fafafa] to-white border-b">
        <div className="container mx-auto px-6 py-14">
          <h1 className="text-3xl md:text-4xl font-bold capitalize text-[#111111]">
            {heading}
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">
            Discover premium {slug} crafted for comfort, durability,
            and everyday style. Hand-picked collections just for you.
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="container mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl font-semibold text-[#111111] mb-2">
              No products available
            </p>
            <p className="text-gray-600 max-w-md">
              We’re working on adding new products to this category.
              Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* ================= TOP BAR ================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b> products
              </p>

              <div className="text-sm text-gray-500">
                Filter:
                <span className="ml-1 font-medium capitalize text-[#111111]">
                  {type || "All"}
                </span>
              </div>
            </div>

            {/* ================= GRID ================= */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* ================= TRUST BADGES ================= */}
      <section className="bg-[#fafafa] border-t">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center text-sm text-gray-600">
            <span>✔ Cash on Delivery</span>
            <span>✔ Premium Quality</span>
            <span>✔ Secure Payments</span>
            <span>✔ Fast Delivery</span>
          </div>
        </div>
      </section>
    </main>
  );
}


// import ProductCard from "@/components/product/ProductCard";
// import { fetchProductsByCategory } from "@/lib/api";
// import { Product } from "@/components/product/product.types";

// /* ================= TYPES ================= */

// type CategoryPageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
//   searchParams?: Promise<{
//     type?: string;
//   }>;
// };

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
// }: CategoryPageProps) {
//   const { slug } = await params; // ✅ unwrap params
//   const resolvedSearchParams = await searchParams; // ✅ unwrap searchParams
//   const type = resolvedSearchParams?.type ?? "";

//   let products: Product[] = [];

//   try {
//     products = await fetchProductsByCategory(slug, {
//       type: type || undefined,
//     });
//   } catch {
//     products = [];
//   }

//   const heading = type
//     ? `${slug} / ${type}`
//     : slug;

//   return (
//     <main className="pt-24 bg-white min-h-screen">
//       {/* ================= HEADER ================= */}
//       <section className="bg-[#fafafa] border-b">
//         <div className="container mx-auto px-6 py-12">
//           <h1 className="text-3xl font-bold capitalize text-[#111111]">
//             {heading}
//           </h1>

//           <p className="text-gray-600 mt-2 max-w-xl">
//             Browse our latest collection curated for comfort,
//             style and everyday wear.
//           </p>
//         </div>
//       </section>

//       {/* ================= PRODUCTS ================= */}
//       <section className="container mx-auto px-6 py-16">
//         {products.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-lg font-semibold mb-2">
//               No products found
//             </p>
//             <p className="text-gray-600">
//               New items will be added very soon.
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Count + Filter */}
//             <div className="flex items-center justify-between mb-8">
//               <p className="text-sm text-gray-600">
//                 Showing <b>{products.length}</b> products
//               </p>

//               <p className="text-sm text-gray-500">
//                 Filter:{" "}
//                 <span className="font-medium capitalize">
//                   {type || "All"}
//                 </span>
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </section>

//       {/* ================= FOOTER NOTE ================= */}
//       <section className="bg-[#fafafa] border-t">
//         <div className="container mx-auto px-6 py-10 text-center">
//           <p className="text-sm text-gray-600">
//             ✔ Cash on Delivery • ✔ Premium Quality • ✔ Fast Delivery
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }
