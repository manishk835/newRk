"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export default function SupportPage() {

  const [tickets, setTickets] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      subject: "",

      category: "Order",

      priority: "Medium",

      message: "",

    });

  /* ======================================================
     FETCH TICKETS
  ====================================================== */

  const fetchTickets =
    async () => {

      try {

        const res =
          await fetch(

            `${API_URL}/api/support/my`,

            {
              credentials:
                "include",
            }
          );

        const data =
          await res.json();

        setTickets(data);

      }

      catch (error) {

        console.error(error);

      }

    };

  useEffect(() => {

    fetchTickets();

  }, []);

  /* ======================================================
     CREATE TICKET
  ====================================================== */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await fetch(

            `${API_URL}/api/support`,

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify(
                  form
                ),
            }
          );

        if (!res.ok) {

          throw new Error();

        }

        setForm({

          subject: "",

          category: "Order",

          priority: "Medium",

          message: "",

        });

        fetchTickets();

      }

      catch (error) {

        alert(
          "Failed to create ticket"
        );

      }

      finally {

        setLoading(false);

      }

    };

  return (

    <div className="space-y-8">

      {/* ======================================================
         HEADER
      ====================================================== */}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">

        <h1 className="text-3xl font-bold text-black dark:text-white">

          Support Center

        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">

          Create support tickets and contact RKFashion support team.

        </p>

      </div>

      {/* ======================================================
         CREATE FORM
      ====================================================== */}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">

        <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">

          Create Ticket

        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Subject"
            value={
              form.subject
            }
            onChange={(e) =>
              setForm({

                ...form,

                subject:
                  e.target.value,

              })
            }
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl px-4 py-3"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">

            <select
              value={
                form.category
              }
              onChange={(e) =>
                setForm({

                  ...form,

                  category:
                    e.target.value,

                })
              }
              className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl px-4 py-3"
            >

              <option>
                Order
              </option>

              <option>
                Payment
              </option>

              <option>
                Refund
              </option>

              <option>
                Account
              </option>

              <option>
                Delivery
              </option>

              <option>
                Other
              </option>

            </select>

            <select
              value={
                form.priority
              }
              onChange={(e) =>
                setForm({

                  ...form,

                  priority:
                    e.target.value,

                })
              }
              className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl px-4 py-3"
            >

              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>

            </select>

          </div>

          <textarea
            placeholder="Describe your issue"
            value={
              form.message
            }
            onChange={(e) =>
              setForm({

                ...form,

                message:
                  e.target.value,

              })
            }
            rows={5}
            className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded-xl px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={
              loading
            }
            className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 disabled:opacity-50"
          >

            {loading
              ? "Creating..."
              : "Create Ticket"}

          </button>

        </form>

      </div>

      {/* ======================================================
         TICKETS
      ====================================================== */}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">

        <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">

          My Tickets

        </h2>

        <div className="space-y-4">

          {tickets.length === 0 ? (

            <div className="text-gray-500 dark:text-gray-400">

              No support tickets found.

            </div>

          ) : (

            tickets.map(
              (ticket) => (

                <div
                  key={
                    ticket._id
                  }
                  className="border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-lg text-black dark:text-white">

                        {
                          ticket.subject
                        }

                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">

                        {
                          ticket.category
                        }

                        {" • "}

                        {
                          ticket.priority
                        }

                      </p>

                    </div>

                    <div className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">

                      {
                        ticket.status
                      }

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>

  );

}