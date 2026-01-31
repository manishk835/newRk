import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/components/product/product.types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query ? await searchProducts(query) : [];

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      {!query ? (
        <p>Please enter a search term.</p>
      ) : products.length === 0 ? (
        <p>
          No results found for <b>"{query}"</b>
        </p>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Showing results for <b>"{query}"</b>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


// import ProductCard from "@/components/product/ProductCard";
// import { searchProducts } from "@/lib/api";

// export const metadata = {
//   title: "Search | RK Fashion House",
// };

// type SearchPageProps = {
//   searchParams: {
//     q?: string;
//   };
// };

// export default async function SearchPage({
//   searchParams,
// }: SearchPageProps) {
//   const query = searchParams.q?.trim() || "";

//   const products = query
//     ? await searchProducts(query)
//     : [];

//   return (
//     <main className="pt-24">
//       {/* ================= HEADER ================= */}
//       <section className="border-b bg-[#fafafa]">
//         <div className="container mx-auto px-6 py-10">
//           <h1 className="text-3xl font-bold text-[#111111]">
//             Search Results
//           </h1>

//           {query && (
//             <p className="text-gray-600 mt-2">
//               Showing results for{" "}
//               <b>&quot;{query}&quot;</b>
//             </p>
//           )}
//         </div>
//       </section>

//       {/* ================= RESULTS ================= */}
//       <section className="container mx-auto px-6 py-16">
//         {!query ? (
//           <div className="text-center py-20">
//             <p className="text-gray-600">
//               Start typing to search products.
//             </p>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-lg font-medium mb-2">
//               No products found
//             </p>
//             <p className="text-gray-600">
//               Try searching with different keywords.
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Result count */}
//             <div className="flex items-center justify-between mb-8">
//               <p className="text-sm text-gray-600">
//                 Found <b>{products.length}</b> results
//               </p>

//               {/* Future sort */}
//               <div className="text-sm text-gray-500">
//                 Sort by: <span className="font-medium">Relevance</span>
//               </div>
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
//             Can&apos;t find what you&apos;re looking for?  
//             Explore our full collection.
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }
