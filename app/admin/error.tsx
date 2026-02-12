"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border rounded-xl p-6 max-w-md text-center">
        <h2 className="text-lg font-semibold mb-2">
          Something went wrong
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          An error occurred in admin panel.
        </p>

        <button
          onClick={reset}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
