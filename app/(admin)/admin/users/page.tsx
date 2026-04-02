"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

/* ================= TYPES ================= */

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  sellerStatus?: string;
};

/* ================= PAGE ================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const query = `?search=${search}&role=${role}`;

      const res = await apiFetch(`/admin/users${query}`);

      setUsers(res.users || []);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  /* ================= BLOCK / UNBLOCK ================= */

  const toggleBlock = async (id: string) => {
    try {
      await apiFetch(`/admin/users/${id}/toggle-block`, {
        method: "PATCH",
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, isBlocked: !u.isBlocked }
            : u
        )
      );
    } catch {
      alert("Action failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">
        Users Management
      </h1>

      {/* FILTERS */}
      <div className="flex gap-4 flex-wrap">

        <input
          placeholder="Search name/email..."
          className="border px-4 py-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        ) : (

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user._id} className="border-t">

                  <td className="p-4">{user.name}</td>

                  <td>{user.email}</td>

                  <td className="capitalize">
                    {user.role}
                  </td>

                  <td>
                    {user.isBlocked ? (
                      <span className="text-red-500">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600">
                        Active
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => toggleBlock(user._id)}
                      className={`px-4 py-1 rounded-lg text-white ${
                        user.isBlocked
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {user.isBlocked
                        ? "Unblock"
                        : "Block"}
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