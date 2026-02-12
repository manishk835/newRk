import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          The admin page you are looking for does not exist.
        </p>

        <Link
          href="/admin"
          className="inline-block bg-black text-white px-6 py-2 rounded-lg text-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
