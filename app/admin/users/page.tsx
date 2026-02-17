// app/admin/users/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
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
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Users fetch error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-10">
        Loading users...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-10 pb-16 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">
        Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-600">
          No users found
        </p>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {u.name || "Unnamed User"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {u.phone || u.email || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(
                      u.createdAt
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/users/${u._id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View
                    </Link>
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
