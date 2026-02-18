// app/account/addressess/psge.tsx
"use client";

import { useEffect, useState } from "react";

type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* ================= LOAD ================= */
  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
        { credentials: "include" }
      );
      
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load addresses");
      }
      

      setAddresses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  /* ================= SAVE (ADD / EDIT) ================= */
  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/address/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/address`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await fetchAddresses();

      setForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });

      setEditingId(null);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

/* ================= DELETE ================= */
const deleteAddress = async (id: string) => {
  if (!confirm("Delete this address?")) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/address/${id}`,
      { method: "DELETE", credentials: "include" }
    );

    if (res.ok) {
      fetchAddresses();
    } else {
      const data = await res.json();
      alert(data?.message || "Delete failed");
    }
  } catch (err) {
    alert("Something went wrong");
  }
};


/* ================= SET DEFAULT ================= */
const setDefault = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/address/${id}/default`,
      { method: "PATCH", credentials: "include" }
    );

    if (res.ok) {
      fetchAddresses();
    } else {
      const data = await res.json();
      alert(data?.message || "Failed to set default");
    }
  } catch (err) {
    alert("Something went wrong");
  }
};

  
  /* ================= EDIT ================= */
  const startEdit = (addr: Address) => {
    setForm({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode,
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  if (loading)
    return <p className="text-center py-10">Loading addresses...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>

        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90"
        >
          + Add Address
        </button>
      </div>

      {/* EMPTY */}
      {addresses.length === 0 && (
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">📍</div>
          <p className="text-gray-600">No saved addresses yet.</p>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{addr.name}</p>
                  {addr.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm">{addr.address}</p>
                <p className="text-gray-600 text-sm">
                  {addr.city} - {addr.pincode}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {addr.phone}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Make Default
                  </button>
                )}

                <button
                  onClick={() => startEdit(addr)}
                  className="text-black hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">

            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Address" : "Add New Address"}
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
                  setEditingId(null);
                  setError("");
                }}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save"}
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

// type Address = {
//   _id: string;
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
// };

// export default function AddressesPage() {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     pincode: "",
//   });

//   /* ================= LOAD FROM BACKEND ================= */
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
//           {
//             credentials: "include",
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || "Failed to load addresses");
//         }

//         setAddresses(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAddresses();
//   }, []);

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

//   /* ================= ADD ADDRESS ================= */
//   const addAddress = async () => {
//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError("");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to add address");
//       }

//       setAddresses([data, ...addresses]);

//       setForm({
//         name: "",
//         phone: "",
//         address: "",
//         city: "",
//         pincode: "",
//       });

//       setShowForm(false);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= DELETE ADDRESS ================= */
//   const deleteAddress = async (id: string) => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${id}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to delete");
//       }

//       setAddresses(addresses.filter((a) => a._id !== id));
//     } catch (err: any) {
//       alert(err.message);
//     }
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

//       {/* EMPTY */}
//       {addresses.length === 0 && (
//         <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
//           <div className="text-4xl mb-4">📍</div>
//           <p className="text-gray-600">
//             No saved addresses yet.
//           </p>
//         </div>
//       )}

//       {/* LIST */}
//       <div className="grid gap-6">
//         {addresses.map((addr) => (
//           <div
//             key={addr._id}
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
//                 onClick={() => deleteAddress(addr._id)}
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
//                 disabled={submitting}
//                 onClick={addAddress}
//                 className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-60"
//               >
//                 {submitting ? "Saving..." : "Save Address"}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }