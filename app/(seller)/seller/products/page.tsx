async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/products`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to load products");

  return res.json();
}

export default async function SellerProducts() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Products</h1>

      <div className="space-y-4">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-gray-500">
                Stock: {product.totalStock}
              </p>
            </div>

            <div className="font-bold">₹{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// // app/(seller)/seller/products/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";

// export default function SellerProductsPage() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       const data = await apiFetch("/seller/products");
//       setProducts(data || []);
//       setLoading(false);
//     };

//     load();
//   }, []);

//   if (loading) return <div>Loading products...</div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">
//         My Products
//       </h1>

//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="bg-white border rounded-2xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-4 text-left">Title</th>
//                 <th className="px-6 py-4 text-center">Price</th>
//                 <th className="px-6 py-4 text-center">Stock</th>
//                 <th className="px-6 py-4 text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map(p => (
//                 <tr key={p._id} className="border-t">
//                   <td className="px-6 py-4">{p.title}</td>
//                   <td className="px-6 py-4 text-center">₹{p.price}</td>
//                   <td className="px-6 py-4 text-center">{p.totalStock}</td>
//                   <td className="px-6 py-4 text-center">
//                     {p.isApproved ? (
//                       <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
//                         Approved
//                       </span>
//                     ) : (
//                       <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
//                         Pending
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }