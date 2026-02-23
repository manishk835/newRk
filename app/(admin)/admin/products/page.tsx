"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type AdminProduct = {
  _id: string;
  title: string;
  price: number;
  category: string;
  subCategory?: string;
  thumbnail?: string;
  totalStock: number;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  seller?: {
    name: string;
    email: string;
  };
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {
    try {
      const data = await apiFetch("/admin/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= ACTIONS ================= */

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await apiFetch(`/admin/products/${id}/approve`, {
        method: "PUT",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isApproved: true } : p
        )
      );
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setProcessingId(id);
      const updated = await apiFetch(
        `/admin/products/${id}/toggle-active`,
        { method: "PUT" }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isActive: updated.isActive } : p
        )
      );
    } catch (err) {
      console.error("Toggle failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      setProcessingId(id);
      await apiFetch(`/admin/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="pt-28 px-6">Loading products...</div>;
  }

  return (
    <div className="pt-10 pb-16 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          All Products
        </h1>

        <button
          onClick={() =>
            router.push("/admin/products/create")
          }
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left">Product</th>
                <th className="px-4 py-4 text-center">Seller</th>
                <th className="px-4 py-4 text-center">Price</th>
                <th className="px-4 py-4 text-center">Stock</th>
                <th className="px-4 py-4 text-center">Approval</th>
                <th className="px-4 py-4 text-center">Active</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail || "/placeholder.png"}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">
                          {p.title}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {p.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {p.seller?.name || "Admin"}
                  </td>

                  <td className="px-4 py-4 text-center">
                    ₹{p.price}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {p.totalStock}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {p.isApproved ? (
                      <span className="text-green-600 font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {p.isActive ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center space-x-2">
                    {!p.isApproved && (
                      <button
                        onClick={() =>
                          handleApprove(p._id)
                        }
                        disabled={
                          processingId === p._id
                        }
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleToggleActive(p._id)
                      }
                      disabled={
                        processingId === p._id
                      }
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(p._id)
                      }
                      disabled={
                        processingId === p._id
                      }
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
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

// // app/admin/products/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { fetchProducts } from "@/lib/api";
// import { AdminProduct } from "@/lib/types/adminProduct";


// /* ================= PAGE ================= */

// export default function AdminProductsPage() {
//   const router = useRouter();

//   const [products, setProducts] = useState<AdminProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD ================= */

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data as AdminProduct[]);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, []);

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 pt-28">
//         Loading products...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           Products
//         </h1>

//         <button
//           onClick={() =>
//             router.push("/admin/products/create")
//           }
//           className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* EMPTY STATE */}
//       {products.length === 0 ? (
//         <div className="text-gray-600">
//           No products found.
//         </div>
//       ) : (
//         <div className="overflow-x-auto border rounded-xl bg-white">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-4 py-3 text-left">
//                   Title
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Category
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Price
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Flags
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Created
//                 </th>
//                 <th className="px-4 py-3 text-center">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => (
//                 <tr
//                   key={p._id}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="px-4 py-3">
//                     <div className="font-medium">
//                       {p.title}
//                     </div>
//                   </td>

//                   <td className="px-4 py-3 text-center capitalize">
//                     {p.category}
//                     {p.subCategory
//                       ? ` / ${p.subCategory}`
//                       : ""}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     ₹{p.price}
//                   </td>

//                   <td className="px-4 py-3 text-center space-x-1">
//                     {p.isFeatured && (
//                       <span className="inline-block text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
//                         Featured
//                       </span>
//                     )}
//                     {p.isNewArrival && (
//                       <span className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
//                         New
//                       </span>
//                     )}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     {p.isActive ? (
//                       <span className="text-green-600 font-medium">
//                         Active
//                       </span>
//                     ) : (
//                       <span className="text-red-600 font-medium">
//                         Inactive
//                       </span>
//                     )}
//                   </td>

//                   <td className="px-4 py-3 text-center text-gray-600">
//                     {new Date(
//                       p.createdAt
//                     ).toLocaleDateString()}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() =>
//                         router.push(
//                           `/admin/products/${p._id}`
//                         )
//                       }
//                       className="text-blue-600 text-sm hover:underline"
//                     >
//                       Edit
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
