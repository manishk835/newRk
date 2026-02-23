"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  title: string;
  price: number;
  totalStock: number;
  thumbnail?: string;
  category?: string;
  subCategory?: string;
  createdAt: string;
  seller?: {
    name: string;
    email: string;
  };
};

export default function PendingProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  /* ================= LOAD ================= */

  const loadProducts = async () => {
    try {
      const data = await apiFetch("/admin/products/pending");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load pending products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= APPROVE ================= */

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);

      await apiFetch(`/admin/products/${id}/approve`, {
        method: "PUT",
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Approve failed", err);
      alert("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= REJECT ================= */

  const handleReject = async (id: string) => {
    if (!confirm("Reject this product?")) return;

    try {
      setProcessingId(id);

      await apiFetch(`/admin/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Reject failed", err);
      alert("Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-600">
        Loading pending products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-10 pb-16 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Pending Product Approvals
      </h1>

      {products.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-600">
          🎉 No pending products
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Seller</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Category</th>
                <th className="px-6 py-4 text-center">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || "/placeholder.png"}
                        className="w-12 h-12 object-cover rounded"
                        alt={product.title}
                      />
                      <div>
                        <div className="font-medium">
                          {product.title}
                        </div>
                        <div className="text-xs text-yellow-600">
                          Pending Approval
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {product.seller?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.seller?.email}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    ₹{product.price}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {product.totalStock}
                  </td>

                  <td className="px-6 py-4 text-center capitalize">
                    {product.category}
                    {product.subCategory
                      ? ` / ${product.subCategory}`
                      : ""}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/products/${product._id}`)
                      }
                      className="text-xs bg-gray-200 px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleApprove(product._id)}
                      disabled={processingId === product._id}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {processingId === product._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(product._id)}
                      disabled={processingId === product._id}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// // app/(admin)/admin/products/pending/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";

// type Product = {
//   _id: string;
//   title: string;
//   price: number;
//   totalStock: number;
//   createdAt: string;
//   seller?: {
//     name: string;
//     email: string;
//   };
// };

// export default function PendingProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const loadProducts = async () => {
//     try {
//       const data = await apiFetch("/admin/products/pending");
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load pending products", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const handleApprove = async (id: string) => {
//     try {
//       setProcessingId(id);
//       await apiFetch(`/admin/products/${id}/approve`, {
//         method: "PUT",
//       });

//       setProducts((prev) =>
//         prev.filter((p) => p._id !== id)
//       );
//     } catch (err) {
//       console.error("Approve failed", err);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   if (loading) {
//     return <div>Loading pending products...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">
//         Pending Products
//       </h1>

//       {products.length === 0 ? (
//         <p className="text-gray-600">
//           No pending products 🎉
//         </p>
//       ) : (
//         <div className="bg-white border rounded-2xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-6 py-4">Title</th>
//                 <th className="text-left px-6 py-4">Seller</th>
//                 <th className="text-left px-6 py-4">Price</th>
//                 <th className="text-left px-6 py-4">Stock</th>
//                 <th className="text-left px-6 py-4">Created</th>
//                 <th className="text-right px-6 py-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr
//                   key={product._id}
//                   className="border-t"
//                 >
//                   <td className="px-6 py-4">
//                     {product.title}
//                   </td>
//                   <td className="px-6 py-4">
//                     {product.seller?.name || "N/A"}
//                   </td>
//                   <td className="px-6 py-4">
//                     ₹{product.price}
//                   </td>
//                   <td className="px-6 py-4">
//                     {product.totalStock}
//                   </td>
//                   <td className="px-6 py-4">
//                     {new Date(
//                       product.createdAt
//                     ).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <button
//                       onClick={() =>
//                         handleApprove(product._id)
//                       }
//                       disabled={
//                         processingId === product._id
//                       }
//                       className="bg-black text-white px-4 py-2 rounded-lg text-xs hover:opacity-80 disabled:opacity-50"
//                     >
//                       {processingId === product._id
//                         ? "Approving..."
//                         : "Approve"}
//                     </button>
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