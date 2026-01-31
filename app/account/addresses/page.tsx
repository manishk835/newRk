"use client";

import { useEffect, useState } from "react";

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

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    const stored = localStorage.getItem("rk_addresses");
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  /* ================= DELETE ADDRESS ================= */
  const deleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("rk_addresses", JSON.stringify(updated));
  };

  if (loading) {
    return <p>Loading addresses...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Saved Addresses
      </h1>

      {addresses.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-gray-600 mb-4">
            You haven&apos;t added any address yet.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-xl">
            Add New Address
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border rounded-2xl p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {addr.name}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {addr.address}, {addr.city} – {addr.pincode}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {addr.phone}
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
      )}
    </div>
  );
}
