"use client";

import { useState } from "react";

import { apiFetch } from "@/lib/api/client";

import Papa, {
  ParseResult,
} from "papaparse";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type CSVRow = Record<
  string,
  string
>;

/* ================= PAGE ================= */

export default function BulkUploadPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [data, setData] =
    useState<CSVRow[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* ================= PREVIEW CSV ================= */

  const handlePreview = () => {

    if (!file) {

      alert(
        "Please select a file first"
      );

      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (
        results: ParseResult<CSVRow>
      ) => {
        setData(results.data);
      },

      error: (err) => {

        console.error(err);

        alert(
          "CSV parsing failed"
        );

      },
    });
  };

  /* ================= FINAL UPLOAD ================= */

  const handleUpload = async () => {

    if (!file) {

      alert(
        "Please select a file first"
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      setLoading(true);

      const res =
        await apiFetch(
          "/bulk/products",
          {
            method: "POST",
            body: formData,
          }
        );

      alert(
        `✅ Uploaded ${res.count} products`
      );

      // reset
      setData([]);

      setFile(null);

    } catch (err) {

      console.error(err);

      alert(
        "❌ Upload failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300">

      {/* HEADER */}
      <div>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Bulk Upload Products
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload multiple products using CSV
        </p>

      </div>

      {/* UPLOAD CARD */}
      <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

        <CardHeader>

          <CardTitle className="text-black dark:text-white">
            Upload CSV File
          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-5">

          {/* FILE INPUT */}
          <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-6 text-center bg-gray-50 dark:bg-zinc-800/50 transition">

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFile(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
              className="block mx-auto text-sm text-gray-600 dark:text-gray-300"
            />

            {file && (

              <p className="mt-3 text-sm text-black dark:text-white font-medium">
                📄 {file.name}
              </p>

            )}

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">

            <Button
              onClick={
                handlePreview
              }
              className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition"
            >
              Preview CSV
            </Button>

            <Button
              onClick={
                handleUpload
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {loading
                ? "Uploading..."
                : "Upload"}
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* PREVIEW TABLE */}
      {data.length > 0 && (

        <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

          <CardHeader>

            <CardTitle className="text-black dark:text-white">
              Preview ({data.length} rows)
            </CardTitle>

          </CardHeader>

          <CardContent className="overflow-x-auto">

            <table className="w-full text-sm border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">

              <thead className="bg-gray-100 dark:bg-zinc-800">

                <tr>

                  {Object.keys(
                    data[0]
                  ).map((key) => (

                    <th
                      key={key}
                      className="border border-gray-200 dark:border-zinc-700 px-3 py-2 text-left text-black dark:text-white font-medium whitespace-nowrap"
                    >
                      {key}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {data
                  .slice(0, 10)
                  .map(
                    (
                      row,
                      i
                    ) => (

                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition"
                      >

                        {Object.values(
                          row
                        ).map(
                          (
                            val,
                            j
                          ) => (

                            <td
                              key={j}
                              className="border border-gray-200 dark:border-zinc-800 px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                            >
                              {val ||
                                "-"}
                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

              </tbody>

            </table>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Showing first 10 rows
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  );
}