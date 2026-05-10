// app/(admin)/admin/users/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

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

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    string | null
  >(null);

  /* ================= FETCH ================= */

  const fetchUsers =
    async () => {
      try {

        setLoading(true);

        const query = `?search=${search}&role=${role}`;

        const res =
          await apiFetch(
            `/admin/users${query}`
          );

        setUsers(
          res.users || []
        );

      } catch {

        alert(
          "Failed to load users"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  /* ================= BLOCK ================= */

  const toggleBlock =
    async (id: string) => {
      try {

        setActionLoading(id);

        await apiFetch(
          `/admin/users/${id}/toggle-block`,
          {
            method: "PATCH",
          }
        );

        setUsers(
          (prev) =>
            prev.map(
              (u) =>
                u._id === id
                  ? {
                      ...u,
                      isBlocked:
                        !u.isBlocked,
                    }
                  : u
            )
        );

      } catch {

        alert(
          "Action failed"
        );

      } finally {

        setActionLoading(
          null
        );

      }
    };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Users Management
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage platform users, sellers and admins
        </p>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          placeholder="Search name/email..."
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none w-full md:w-72"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* ROLE */}
        <select
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 rounded-xl outline-none"
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >

          <option value="">
            All Roles
          </option>

          <option value="user">
            User
          </option>

          <option value="seller">
            Seller
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">

        {loading ? (

          <div className="p-8 space-y-4">

            {[...Array(5)].map(
              (_, i) => (

                <div
                  key={i}
                  className="h-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"
                />

              )
            )}

          </div>

        ) : users.length ===
          0 ? (

          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100 dark:bg-zinc-800 text-left text-gray-700 dark:text-gray-300">

                <tr>

                  <th className="p-4">
                    Name
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Role
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Action
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {users.map(
                  (user) => {

                    const isLoading =
                      actionLoading ===
                      user._id;

                    return (
                      <tr
                        key={
                          user._id
                        }
                        className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                      >

                        {/* NAME */}
                        <td className="p-4 font-medium text-black dark:text-white">
                          {
                            user.name
                          }
                        </td>

                        {/* EMAIL */}
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {
                            user.email
                          }
                        </td>

                        {/* ROLE */}
                        <td className="p-4 capitalize text-black dark:text-white">
                          {
                            user.role
                          }
                        </td>

                        {/* STATUS */}
                        <td className="p-4">

                          {user.isBlocked ? (

                            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                              Blocked
                            </span>

                          ) : (

                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                              Active
                            </span>

                          )}

                        </td>

                        {/* ACTION */}
                        <td className="p-4">

                          <button
                            disabled={
                              isLoading
                            }
                            onClick={() =>
                              toggleBlock(
                                user._id
                              )
                            }
                            className={`px-4 py-2 rounded-xl text-white text-xs font-medium transition ${
                              user.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-500 hover:bg-red-600"
                            } disabled:opacity-50`}
                          >

                            {isLoading
                              ? "Processing..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}