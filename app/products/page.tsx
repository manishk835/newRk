import ProductCard from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api";

export const metadata = {
  title: "All Products | RK Fashion House",
};

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="pt-24 bg-gray-50">
      {/* ================= HEADER ================= */}
      <section className="border-b bg-white">
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
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="hidden lg:block bg-white border rounded-xl p-6 h-fit sticky top-28">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>

            {/* Category */}
            <div className="mb-6">
              <p className="font-medium mb-2">Category</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><input type="checkbox" /> Men</li>
                <li><input type="checkbox" /> Women</li>
                <li><input type="checkbox" /> Footwear</li>
              </ul>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="font-medium mb-2">Price</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><input type="checkbox" /> Under ₹500</li>
                <li><input type="checkbox" /> ₹500 – ₹1000</li>
                <li><input type="checkbox" /> ₹1000 – ₹2000</li>
              </ul>
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {["S", "M", "L", "XL", "2XL"].map((size) => (
                  <span
                    key={size}
                    className="border rounded px-3 py-1 text-sm cursor-pointer hover:border-black"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-2">
                {["Black", "Green", "Blue", "White"].map((color) => (
                  <span
                    key={color}
                    className="border rounded px-3 py-1 text-sm cursor-pointer hover:border-black"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="lg:col-span-3">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                Showing <b>{products.length}</b> products
              </p>

              <select className="border rounded px-3 py-2 text-sm">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Seller</option>
              </select>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                No products available right now.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
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


// import ProductCard from "@/components/product/ProductCard";
// import { fetchProducts } from "@/lib/api";

// export const metadata = {
//   title: "All Products | RK Fashion House",
// };

// export default async function ProductsPage() {
//   const products = await fetchProducts();

//   return (
//     <main className="pt-24">
//       {/* ================= HEADER ================= */}
//       <section className="border-b bg-[#fafafa]">
//         <div className="container mx-auto px-6 py-10">
//           <h1 className="text-3xl font-bold text-[#111111]">
//             All Products
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Explore our complete collection — premium quality,
//             honest pricing and latest styles.
//           </p>
//         </div>
//       </section>

//       {/* ================= PRODUCT GRID ================= */}
//       <section className="container mx-auto px-6 py-16">
//         {products.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-600">
//               No products available right now.
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Result Count */}
//             <div className="flex items-center justify-between mb-8">
//               <p className="text-sm text-gray-600">
//                 Showing <b>{products.length}</b> products
//               </p>

//               {/* (Future ready) Sort placeholder */}
//               <div className="text-sm text-gray-500">
//                 Sort by: <span className="font-medium">Newest</span>
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
//             ✔ Cash on Delivery • ✔ Premium Quality • ✔ Fast Delivery
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }
