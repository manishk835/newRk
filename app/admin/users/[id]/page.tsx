"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= TYPES ================= */

type User = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt: string;
  isBlocked?: boolean;
};

/* ================= PAGE ================= */

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`,
          {
            cache: "no-store",
            credentials: "include", // 🔥 IMPORTANT
          }
        );

        if (!res.ok) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-10">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 pt-10">
        User not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 mb-4"
      >
        ← Back
      </button>

      <div className="border rounded-2xl p-6 bg-white">
        <h1 className="text-xl font-bold mb-6">
          User Details
        </h1>

        <div className="space-y-4 text-sm">
          <Detail label="Name" value={user.name} />
          <Detail label="Email" value={user.email} />
          <Detail label="Phone" value={user.phone} />
          <Detail label="Role" value={user.role} />
          <Detail
            label="Joined"
            value={new Date(
              user.createdAt
            ).toLocaleString("en-IN")}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <p>
      <span className="font-medium">{label}:</span>{" "}
      {value || "-"}
    </p>
  );
}
