"use client";

import { useEffect, useState } from "react";

type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* ================= LOAD FROM BACKEND ================= */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load addresses");
        }

        setAddresses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name.trim()) return "Name required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return "Enter valid 10 digit mobile number";
    if (!form.address.trim()) return "Address required";
    if (!form.city.trim()) return "City required";
    if (!/^\d{6}$/.test(form.pincode))
      return "Enter valid 6 digit pincode";
    return "";
  };

  /* ================= ADD ADDRESS ================= */
  const addAddress = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      setAddresses([data, ...addresses]);

      setForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });

      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ADDRESS ================= */
  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete");
      }

      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading)
    return <p className="text-center py-10">Loading addresses...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90"
        >
          + Add Address
        </button>
      </div>

      {/* EMPTY */}
      {addresses.length === 0 && (
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">📍</div>
          <p className="text-gray-600">
            No saved addresses yet.
          </p>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold text-lg">{addr.name}</p>
                <p className="text-gray-600 text-sm">
                  {addr.address}
                </p>
                <p className="text-gray-600 text-sm">
                  {addr.city} - {addr.pincode}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {addr.phone}
                </p>
              </div>

              <button
                onClick={() => deleteAddress(addr._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">

            <h2 className="text-lg font-semibold">
              Add New Address
            </h2>

            <div className="space-y-3">

              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />

              <input
                placeholder="Mobile Number"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />

              <textarea
                placeholder="Full Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />

              <input
                placeholder="Pincode"
                maxLength={6}
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={addAddress}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Address"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { v4 as uuid } from "uuid";

// type Address = {
//   id: string;
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
// };

// export default function AddressesPage() {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState<Omit<Address, "id">>({
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     pincode: "",
//   });

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     const stored = localStorage.getItem("rk_addresses");
//     if (stored) setAddresses(JSON.parse(stored));
//     setLoading(false);
//   }, []);

//   /* ================= SAVE ================= */
//   const saveAddresses = (data: Address[]) => {
//     setAddresses(data);
//     localStorage.setItem("rk_addresses", JSON.stringify(data));
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!form.name.trim()) return "Name required";
//     if (!/^[6-9]\d{9}$/.test(form.phone))
//       return "Enter valid 10 digit mobile number";
//     if (!form.address.trim()) return "Address required";
//     if (!form.city.trim()) return "City required";
//     if (!/^\d{6}$/.test(form.pincode))
//       return "Enter valid 6 digit pincode";
//     return "";
//   };

//   /* ================= ADD ================= */
//   const addAddress = () => {
//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const updated = [
//       {
//         id: uuid(),
//         ...form,
//       },
//       ...addresses,
//     ];

//     saveAddresses(updated);

//     setForm({
//       name: "",
//       phone: "",
//       address: "",
//       city: "",
//       pincode: "",
//     });

//     setError("");
//     setShowForm(false);
//   };

//   /* ================= DELETE ================= */
//   const deleteAddress = (id: string) => {
//     const updated = addresses.filter((a) => a.id !== id);
//     saveAddresses(updated);
//   };

//   if (loading)
//     return <p className="text-center py-10">Loading addresses...</p>;

//   return (
//     <div className="max-w-3xl mx-auto space-y-8">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Saved Addresses</h1>

//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90"
//         >
//           + Add Address
//         </button>
//       </div>

//       {/* EMPTY STATE */}
//       {addresses.length === 0 && (
//         <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
//           <div className="text-4xl mb-4">📍</div>
//           <p className="text-gray-600 mb-4">
//             No saved addresses yet.
//           </p>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-black text-white px-6 py-3 rounded-xl"
//           >
//             Add Your First Address
//           </button>
//         </div>
//       )}

//       {/* ADDRESS LIST */}
//       <div className="grid gap-6">
//         {addresses.map((addr) => (
//           <div
//             key={addr.id}
//             className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
//           >
//             <div className="flex justify-between items-start">
//               <div className="space-y-1">
//                 <p className="font-semibold text-lg">{addr.name}</p>
//                 <p className="text-gray-600 text-sm">
//                   {addr.address}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   {addr.city} - {addr.pincode}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   📞 {addr.phone}
//                 </p>
//               </div>

//               <button
//                 onClick={() => deleteAddress(addr.id)}
//                 className="text-sm text-red-600 hover:underline"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">

//             <h2 className="text-lg font-semibold">
//               Add New Address
//             </h2>

//             <div className="space-y-3">

//               <input
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//                 className="w-full border px-4 py-2 rounded-lg"
//               />

//               <input
//                 placeholder="Mobile Number"
//                 maxLength={10}
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     phone: e.target.value.replace(/\D/g, ""),
//                   })
//                 }
//                 className="w-full border px-4 py-2 rounded-lg"
//               />

//               <textarea
//                 placeholder="Full Address"
//                 value={form.address}
//                 onChange={(e) =>
//                   setForm({ ...form, address: e.target.value })
//                 }
//                 className="w-full border px-4 py-2 rounded-lg"
//               />

//               <input
//                 placeholder="City"
//                 value={form.city}
//                 onChange={(e) =>
//                   setForm({ ...form, city: e.target.value })
//                 }
//                 className="w-full border px-4 py-2 rounded-lg"
//               />

//               <input
//                 placeholder="Pincode"
//                 maxLength={6}
//                 value={form.pincode}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     pincode: e.target.value.replace(/\D/g, ""),
//                   })
//                 }
//                 className="w-full border px-4 py-2 rounded-lg"
//               />

//               {error && (
//                 <p className="text-sm text-red-600">{error}</p>
//               )}

//             </div>

//             <div className="flex justify-end gap-3 pt-2">
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   setError("");
//                 }}
//                 className="px-4 py-2 text-sm border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={addAddress}
//                 className="px-4 py-2 text-sm bg-black text-white rounded-lg"
//               >
//                 Save Address
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }