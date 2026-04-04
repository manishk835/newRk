"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import Papa, { ParseResult } from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* TYPE (better than any) */
type CSVRow = Record<string, string>;

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(false);

  /* PARSE CSV (FRONTEND) */
  const handlePreview = () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        setData(results.data);
      },
      error: (err) => {
        console.error(err);
        alert("CSV parsing failed");
      },
    });
  };

  /* FINAL UPLOAD */
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await apiFetch("/bulk/products", {
        method: "POST",
        body: formData,
      });

      alert(`✅ Uploaded ${res.count} products`);

      // reset
      setData([]);
      setFile(null);

    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* UPLOAD */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Products</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="flex gap-3">
            <Button onClick={handlePreview}>
              Preview CSV
            </Button>

            <Button onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* PREVIEW TABLE */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview ({data.length} rows)</CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="border px-2 py-1 bg-gray-100">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border px-2 py-1">
                        {val || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-500 mt-2">
              Showing first 10 rows
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}