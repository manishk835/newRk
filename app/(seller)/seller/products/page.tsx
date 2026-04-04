"use client";

import { useEffect, useState } from "react";
import { getMyProducts } from "./services/product.service";
import ProductTable from "./components/ProductTable";
import ProductStats from "./components/ProductStats";
import { Product } from "./types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await getMyProducts();
      setProducts(res.products || []);
    };

    load();
  }, []);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">
        Your Products
      </h1>

      {/* STATS */}
      <ProductStats products={products} />

      {/* TABLE */}
      <ProductTable products={products} />

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { apiFetch } from "@/lib/api/client";

// /* ================= TYPES ================= */

// type Product = {
//   _id: string;
//   title: string;
//   price: number;
//   isApproved: boolean;
//   thumbnail: string;
//   totalStock: number;
// };

// /* ================= PAGE ================= */

// export default function SellerProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filtered, setFiltered] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [stockFilter, setStockFilter] = useState("all");

//   /* ================= LOAD ================= */

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       const data = await apiFetch("/seller/products");
//       const list = Array.isArray(data) ? data : [];
//       setProducts(list);
//       setFiltered(list);
//     } catch (err) {
//       alert("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   /* ================= FILTER ================= */

//   useEffect(() => {
//     let data = [...products];

//     if (search) {
//       data = data.filter((p) =>
//         p.title.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (statusFilter !== "all") {
//       data = data.filter((p) =>
//         statusFilter === "approved"
//           ? p.isApproved
//           : !p.isApproved
//       );
//     }

//     if (stockFilter === "low") {
//       data = data.filter((p) => p.totalStock <= 5);
//     }

//     setFiltered(data);
//   }, [search, statusFilter, stockFilter, products]);

//   /* ================= DELETE ================= */

//   const deleteProduct = async (id: string) => {
//     if (!confirm("Delete this product?")) return;

//     try {
//       setDeletingId(id);

//       await apiFetch(`/seller/products/${id}`, {
//         method: "DELETE",
//       });

//       setProducts((prev) =>
//         prev.filter((p) => p._id !== id)
//       );

//     } catch {
//       alert("Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">

//         <h1 className="text-2xl font-bold">
//           Products
//         </h1>

//         <Link
//           href="/seller/products/create"
//           className="bg-black text-white px-4 py-2 rounded-lg text-sm"
//         >
//           + Add Product
//         </Link>

//       </div>

//       {/* FILTERS */}
//       <div className="flex flex-wrap gap-3">

//         <input
//           placeholder="Search product..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded-lg text-sm"
//         />

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border px-3 py-2 rounded-lg text-sm"
//         >
//           <option value="all">All Status</option>
//           <option value="approved">Approved</option>
//           <option value="pending">Pending</option>
//         </select>

//         <select
//           value={stockFilter}
//           onChange={(e) => setStockFilter(e.target.value)}
//           className="border px-3 py-2 rounded-lg text-sm"
//         >
//           <option value="all">All Stock</option>
//           <option value="low">Low Stock</option>
//         </select>

//         <button
//           onClick={loadProducts}
//           className="border px-4 py-2 rounded-lg text-sm"
//         >
//           Refresh
//         </button>

//       </div>

//       {/* TABLE */}
//       <div className="bg-white border rounded-2xl overflow-hidden">

//         {loading ? (
//           <div className="p-10 text-center text-gray-500">
//             Loading...
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="p-12 text-center text-gray-500">
//             No products found
//           </div>
//         ) : (
//           <table className="w-full text-sm">

//             <thead className="bg-gray-50 text-gray-600">
//               <tr>
//                 <th className="p-4 text-left">Product</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Stock</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>

//               {filtered.map((p) => (

//                 <tr key={p._id} className="border-t hover:bg-gray-50">

//                   <td className="p-4 flex items-center gap-3">
//                     <img
//                       src={p.thumbnail || "/placeholder.png"}
//                       className="w-12 h-12 object-cover rounded border"
//                     />
//                     <span className="font-medium">
//                       {p.title}
//                     </span>
//                   </td>

//                   <td className="p-4 font-medium">
//                     ₹{p.price}
//                   </td>

//                   <td className="p-4">
//                     {p.totalStock <= 5 ? (
//                       <span className="text-red-600">
//                         {p.totalStock} Low
//                       </span>
//                     ) : (
//                       <span className="text-green-600">
//                         {p.totalStock}
//                       </span>
//                     )}
//                   </td>

//                   <td className="p-4">
//                     {p.isApproved ? (
//                       <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
//                         Approved
//                       </span>
//                     ) : (
//                       <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded-full">
//                         Pending
//                       </span>
//                     )}
//                   </td>

//                   <td className="p-4 space-x-3">

//                     <Link
//                       href={`/seller/products/${p._id}`}
//                       className="text-blue-600"
//                     >
//                       Edit
//                     </Link>

//                     <button
//                       onClick={() => deleteProduct(p._id)}
//                       disabled={deletingId === p._id}
//                       className="text-red-600"
//                     >
//                       {deletingId === p._id
//                         ? "Deleting..."
//                         : "Delete"}
//                     </button>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>
//         )}

//       </div>

//     </div>
//   );
// }

// // app/(seller)/seller/products/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { apiFetch } from "@/lib/api/client";

// type Product = {
//   _id: string;
//   title: string;
//   price: number;
//   isApproved: boolean;
//   thumbnail: string;
//   totalStock: number;
// };

// export default function SellerProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   /* ================= LOAD PRODUCTS ================= */

//   const loadProducts = async () => {
//     try {
//       setLoading(true);

//       const data = await apiFetch("/seller/products");

//       setProducts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Load products error", err);
//       alert("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   /* ================= DELETE PRODUCT ================= */

//   const deleteProduct = async (id: string) => {
//     const confirmDelete = confirm("Delete this product?");

//     if (!confirmDelete) return;

//     try {
//       setDeletingId(id);

//       await apiFetch(`/seller/products/${id}`, {
//         method: "DELETE",
//       });

//       setProducts(prev =>
//         prev.filter(p => p._id !== id)
//       );

//     } catch (err) {
//       alert("Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   /* ================= UI ================= */

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         Loading products...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">

//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-8">

//         <h1 className="text-3xl font-bold">
//           Manage Products
//         </h1>

//         <div className="flex gap-3">

//           <button
//             onClick={loadProducts}
//             className="border px-4 py-2 rounded-lg text-sm"
//           >
//             Refresh
//           </button>

//           <Link
//             href="/seller/products/create"
//             className="bg-black text-white px-5 py-2 rounded-lg"
//           >
//             + Add Product
//           </Link>

//         </div>

//       </div>

//       {/* TABLE */}

//       <div className="bg-white rounded-2xl shadow border overflow-hidden">

//         {products.length === 0 ? (

//           <div className="p-12 text-center text-gray-500">
//             No products yet. Start by adding your first product.
//           </div>

//         ) : (

//           <table className="w-full text-sm">

//             <thead className="bg-gray-50 text-gray-600">
//               <tr>
//                 <th className="p-4 text-left">Product</th>
//                 <th className="p-4 text-left">Price</th>
//                 <th className="p-4 text-left">Stock</th>
//                 <th className="p-4 text-left">Status</th>
//                 <th className="p-4 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>

//               {products.map(product => (

//                 <tr
//                   key={product._id}
//                   className="border-t hover:bg-gray-50"
//                 >

//                   {/* PRODUCT */}

//                   <td className="p-4 flex items-center gap-3">

//                     <img
//                       src={product.thumbnail || "/placeholder.png"}
//                       className="w-12 h-12 rounded object-cover border"
//                     />

//                     <span className="font-medium">
//                       {product.title}
//                     </span>

//                   </td>

//                   {/* PRICE */}

//                   <td className="p-4 font-medium">
//                     ₹{product.price}
//                   </td>

//                   {/* STOCK */}

//                   <td className="p-4">

//                     {product.totalStock > 5 ? (
//                       <span className="text-green-600">
//                         {product.totalStock}
//                       </span>
//                     ) : (
//                       <span className="text-red-600">
//                         {product.totalStock} (Low)
//                       </span>
//                     )}

//                   </td>

//                   {/* STATUS */}

//                   <td className="p-4">

//                     {product.isApproved ? (

//                       <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                         Approved
//                       </span>

//                     ) : (

//                       <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//                         Pending Approval
//                       </span>

//                     )}

//                   </td>

//                   {/* ACTION */}

//                   <td className="p-4 space-x-4">

//                     <Link
//                       href={`/seller/products/${product._id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </Link>

//                     <button
//                       onClick={() =>
//                         deleteProduct(product._id)
//                       }
//                       disabled={deletingId === product._id}
//                       className="text-red-600 hover:underline"
//                     >
//                       {deletingId === product._id
//                         ? "Deleting..."
//                         : "Delete"}
//                     </button>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         )}

//       </div>

//     </div>
//   );
// }