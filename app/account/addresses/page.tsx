"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

type Address = {
  id: string;
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
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Omit<Address, "id">>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    isDefault: false,
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const stored = localStorage.getItem("rk_addresses");
    if (stored) setAddresses(JSON.parse(stored));
    setLoading(false);
  }, []);

  /* ================= SAVE ================= */
  const saveAddresses = (data: Address[]) => {
    setAddresses(data);
    localStorage.setItem("rk_addresses", JSON.stringify(data));
  };

  /* ================= ADD ================= */
  const addAddress = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    )
      return;

    let updated = [...addresses];

    if (form.isDefault) {
      updated = updated.map((a) => ({
        ...a,
        isDefault: false,
      }));
    }

    updated.unshift({
      id: uuid(),
      ...form,
    });

    saveAddresses(updated);

    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      isDefault: false,
    });

    setShowForm(false);
  };

  /* ================= DELETE ================= */
  const deleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    saveAddresses(updated);
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Saved Addresses
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90"
        >
          + Add New
        </button>
      </div>

      {/* EMPTY */}
      {addresses.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="text-4xl mb-4">📍</div>
          <p className="text-gray-600 mb-4">
            You haven’t added any address yet.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Add Address
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between">

              <div>
                <p className="font-semibold">
                  {addr.name}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  {addr.address}
                </p>

                <p className="text-sm text-gray-600">
                  {addr.city} – {addr.pincode}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  📞 {addr.phone}
                </p>
              </div>

              <button
                onClick={() => deleteAddress(addr.id)}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Add New Address
            </h2>

            {["name", "phone", "city", "pincode"].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={(form as any)[f]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f]: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg"
              />
            ))}

            <textarea
              placeholder="Full Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDefault: e.target.checked,
                  })
                }
              />
              Set as default address
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={addAddress}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
