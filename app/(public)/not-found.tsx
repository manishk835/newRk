// app/(public)/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-black text-white rounded-md"
      >
        Go Back Home
      </Link>
    </div>
  );
}