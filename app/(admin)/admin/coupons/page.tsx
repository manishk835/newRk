// app/(admin)/admin/coupons/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Coupon = {
  _id: string;
  code: string;
  description?: string;
  discount: number;
  expiresAt: string;
  isNewUser?: boolean;
  isMember?: boolean;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  /* FORM STATE */
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    expiresAt: "",
    isNewUser: false,
    isMember: false,
  });

  /* ================= LOAD COUPONS ================= */

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      // const res = await apiFetch("/admin/coupons");
      const res = await apiFetch("/coupons");
      setCoupons(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= ADD COUPON ================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      // await apiFetch("/admin/coupons", {
        await apiFetch("/coupons", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          discount: Number(form.discount),
        }),
      });

      setForm({
        code: "",
        description: "",
        discount: "",
        expiresAt: "",
        isNewUser: false,
        isMember: false,
      });

      loadCoupons();
    } catch (err) {
      alert("Failed to create coupon");
    }
  };

  /* ================= DELETE COUPON ================= */

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;

    try {
      // await apiFetch(`/admin/coupons/${id}`, {
        await apiFetch(`/coupons/${id}`, {
        method: "DELETE",
      });

      setCoupons((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Coupons Management
      </h1>

      {/* ================= ADD COUPON ================= */}

      <div className="bg-white border rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-6">
          Add Coupon
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            name="code"
            placeholder="Coupon Code"
            value={form.code}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="discount"
            placeholder="Discount (%)"
            type="number"
            value={form.discount}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="description"
            placeholder="Coupon Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3"
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isNewUser"
                checked={form.isNewUser}
                onChange={handleChange}
              />
              For New User
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isMember"
                checked={form.isMember}
                onChange={handleChange}
              />
              For Member
            </label>
          </div>

          <button
            type="submit"
            className="bg-black text-white rounded-lg px-6 py-3 md:col-span-2"
          >
            Add Coupon
          </button>
        </form>
      </div>

      {/* ================= LIST COUPONS ================= */}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <h2 className="text-lg font-semibold p-6 border-b">
          List Coupons
        </h2>

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="p-6">No coupons found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Expires At</th>
                <th className="p-4">New User</th>
                <th className="p-4">Member</th>
                <th className="p-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {c.code}
                  </td>
                  <td className="p-4">
                    {c.description}
                  </td>
                  <td className="p-4">
                    {c.discount}%
                  </td>
                  <td className="p-4">
                    {new Date(
                      c.expiresAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {c.isNewUser ? "Yes" : "No"}
                  </td>
                  <td className="p-4">
                    {c.isMember ? "Yes" : "No"}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        deleteCoupon(c._id)
                      }
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// /* ================= TYPES ================= */

// type Coupon = {
//   _id: string;
//   code: string;
//   discountPercent: number;
//   isActive: boolean;
//   expiryDate?: string;
// };

// /* ================= PAGE ================= */

// export default function AdminCouponsPage() {
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCoupons = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/admin/coupons`,
//           {
//             credentials: "include", // 🔥 cookie send karega
//             cache: "no-store",
//           }
//         );

//         if (res.status === 401 || res.status === 403) {
//           window.location.href = "/admin/login";
//           return;
//         }

//         if (!res.ok) throw new Error();

//         const data = await res.json();
//         setCoupons(data || []);
//       } catch (err) {
//         console.error("Coupons fetch error:", err);
//         setCoupons([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoupons();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-10">
//         Loading coupons...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-6 pt-10 pb-16 max-w-4xl">
//       <h1 className="text-2xl font-bold mb-6">
//         Coupons
//       </h1>

//       {coupons.length === 0 ? (
//         <p className="text-gray-600">
//           No coupons created
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {coupons.map((c) => (
//             <div
//               key={c._id}
//               className="border rounded-xl p-5 bg-white flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold">
//                   {c.code}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {c.discountPercent}% off
//                 </p>
//                 {c.expiryDate && (
//                   <p className="text-xs text-gray-500">
//                     Expires:{" "}
//                     {new Date(c.expiryDate).toLocaleDateString("en-IN")}
//                   </p>
//                 )}
//               </div>

//               <span
//                 className={`text-xs px-3 py-1 rounded-full ${
//                   c.isActive
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {c.isActive ? "Active" : "Inactive"}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
