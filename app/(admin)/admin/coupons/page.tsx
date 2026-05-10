// app/(admin)/admin/coupons/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/api/client";

import {
  useToast,
  ConfirmModal,
} from "@/components/ui/ui-utils";

/* ================= TYPES ================= */

type Coupon = {
  _id: string;

  code: string;

  description?: string;

  discount: number;

  expiresAt: string;

  isNewUser?: boolean;

  isMember?: boolean;
};

/* ================= PAGE ================= */

export default function CouponsPage() {

  const { showToast } =
    useToast();

  const [coupons, setCoupons] =
    useState<Coupon[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    submitLoading,
    setSubmitLoading,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState<
    string | null
  >(null);

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  /* FORM */
  const [form, setForm] =
    useState({
      code: "",
      description: "",
      discount: "",
      expiresAt: "",
      isNewUser: false,
      isMember: false,
    });

  /* ================= LOAD ================= */

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons =
    async () => {
      try {

        setLoading(true);

        const res =
          await apiFetch(
            "/coupons"
          );

        setCoupons(
          Array.isArray(
            res
          )
            ? res
            : []
        );

      } catch {

        showToast(
          "Failed to load coupons",
          "error"
        );

      } finally {

        setLoading(false);

      }
    };

  /* ================= CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };

  /* ================= SUBMIT ================= */

  const handleSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();

      try {

        setSubmitLoading(
          true
        );

        await apiFetch(
          "/coupons",
          {
            method:
              "POST",

            body: JSON.stringify(
              {
                ...form,
                discount:
                  Number(
                    form.discount
                  ),
              }
            ),
          }
        );

        setForm({
          code: "",
          description:
            "",
          discount: "",
          expiresAt:
            "",
          isNewUser:
            false,
          isMember:
            false,
        });

        showToast(
          "Coupon created",
          "success"
        );

        loadCoupons();

      } catch {

        showToast(
          "Failed to create coupon",
          "error"
        );

      } finally {

        setSubmitLoading(
          false
        );

      }
    };

  /* ================= DELETE ================= */

  const openDelete = (
    id: string
  ) => {

    setSelectedId(id);

    setConfirmOpen(true);
  };

  const deleteCoupon =
    async () => {

      if (!selectedId)
        return;

      try {

        setDeleteLoading(
          selectedId
        );

        await apiFetch(
          `/coupons/${selectedId}`,
          {
            method:
              "DELETE",
          }
        );

        setCoupons(
          (prev) =>
            prev.filter(
              (c) =>
                c._id !==
                selectedId
            )
        );

        showToast(
          "Coupon deleted",
          "success"
        );

      } catch {

        showToast(
          "Delete failed",
          "error"
        );

      } finally {

        setDeleteLoading(
          null
        );

        setSelectedId(
          null
        );

        setConfirmOpen(
          false
        );

      }
    };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          Coupons Management
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create and manage discount coupons
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">

        <h2 className="text-lg font-semibold text-black dark:text-white mb-6">
          Add Coupon
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          className="grid md:grid-cols-2 gap-4"
        >

          {/* CODE */}
          <input
            name="code"
            placeholder="Coupon Code"
            value={form.code}
            onChange={
              handleChange
            }
            required
            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-xl px-4 py-3 outline-none"
          />

          {/* DISCOUNT */}
          <input
            name="discount"
            placeholder="Discount (%)"
            type="number"
            value={
              form.discount
            }
            onChange={
              handleChange
            }
            required
            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-xl px-4 py-3 outline-none"
          />

          {/* DESCRIPTION */}
          <input
            name="description"
            placeholder="Coupon Description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-xl px-4 py-3 outline-none md:col-span-2"
          />

          {/* DATE */}
          <input
            name="expiresAt"
            type="date"
            value={
              form.expiresAt
            }
            onChange={
              handleChange
            }
            required
            className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-xl px-4 py-3 outline-none"
          />

          {/* CHECKBOXES */}
          <div className="flex flex-wrap items-center gap-6 px-1">

            <label className="flex items-center gap-2 text-sm text-black dark:text-white">

              <input
                type="checkbox"
                name="isNewUser"
                checked={
                  form.isNewUser
                }
                onChange={
                  handleChange
                }
              />

              For New User

            </label>

            <label className="flex items-center gap-2 text-sm text-black dark:text-white">

              <input
                type="checkbox"
                name="isMember"
                checked={
                  form.isMember
                }
                onChange={
                  handleChange
                }
              />

              For Member

            </label>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              submitLoading
            }
            className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-6 py-3 font-medium hover:opacity-90 transition md:col-span-2 disabled:opacity-60"
          >

            {submitLoading
              ? "Creating..."
              : "Add Coupon"}

          </button>

        </form>

      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">

        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">

          <h2 className="text-lg font-semibold text-black dark:text-white">
            All Coupons
          </h2>

        </div>

        {loading ? (

          <div className="p-6 space-y-4">

            {[...Array(5)].map(
              (_, i) => (

                <div
                  key={i}
                  className="h-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"
                />

              )
            )}

          </div>

        ) : coupons.length ===
          0 ? (

          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            No coupons found
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-100 dark:bg-zinc-800 text-left text-gray-700 dark:text-gray-300">

                <tr>

                  <th className="p-4">
                    Code
                  </th>

                  <th className="p-4">
                    Description
                  </th>

                  <th className="p-4">
                    Discount
                  </th>

                  <th className="p-4">
                    Expires
                  </th>

                  <th className="p-4">
                    New User
                  </th>

                  <th className="p-4">
                    Member
                  </th>

                  <th className="p-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {coupons.map(
                  (c) => (

                    <tr
                      key={c._id}
                      className="border-t border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                    >

                      <td className="p-4 font-semibold text-black dark:text-white">
                        {c.code}
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {c.description ||
                          "-"}
                      </td>

                      <td className="p-4 text-black dark:text-white">
                        {
                          c.discount
                        }
                        %
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {new Date(
                          c.expiresAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            c.isNewUser
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                              : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                          }`}
                        >

                          {c.isNewUser
                            ? "Yes"
                            : "No"}

                        </span>

                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            c.isMember
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                              : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                          }`}
                        >

                          {c.isMember
                            ? "Yes"
                            : "No"}

                        </span>

                      </td>

                      <td className="p-4 text-right">

                        <button
                          onClick={() =>
                            openDelete(
                              c._id
                            )
                          }
                          disabled={
                            deleteLoading ===
                            c._id
                          }
                          className="text-red-600 dark:text-red-400 text-xs font-medium hover:underline disabled:opacity-50"
                        >

                          {deleteLoading ===
                          c._id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete coupon?"
        description="This action cannot be undone"
        onConfirm={
          deleteCoupon
        }
        onCancel={() =>
          setConfirmOpen(
            false
          )
        }
      />

    </div>
  );
}