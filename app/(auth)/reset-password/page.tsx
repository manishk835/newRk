"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ResetPasswordPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const phone = searchParams.get("phone") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (!phone) {
      router.replace("/login");
    }

  }, [phone, router]);

  useEffect(() => {

    if (!authLoading && user) {
      router.replace("/");
    }

  }, [user, authLoading, router]);

  /* ================= VALIDATION ================= */

  const validate = () => {

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return false;
    }

    return true;

  };

  /* ================= SUBMIT ================= */

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validate()) return;

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccess("Password updated successfully 🎉");

      setTimeout(() => {
        router.replace("/login?reset=success");
      }, 1200);

    } catch (err: any) {

      setError(err.message || "Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  if (authLoading) return null;

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        <button
          onClick={() => router.push("/login")}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-xl font-semibold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create a new secure password
        </p>

        <form onSubmit={submit} className="space-y-5">

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 text-center">
              {success}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>

    </main>

  );

}

// // app/(auth)/reset-password/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/app/providers/AuthProvider";

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, loading: authLoading } = useAuth();

//   const phone = searchParams.get("phone") || "";

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* 🔐 Prevent access without phone */
//   useEffect(() => {
//     if (!phone) {
//       router.replace("/login");
//     }
//   }, [phone, router]);

//   /* 🔁 If already logged in → redirect home */
//   useEffect(() => {
//     if (!authLoading && user) {
//       router.replace("/");
//     }
//   }, [user, authLoading, router]);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }

//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             phone,
//             password,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Reset failed");
//       }

//       setSuccess("Password updated successfully 🎉");

//       setTimeout(() => {
//         router.replace("/login?reset=success");
//       }, 1500);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading) return null;

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h2 className="text-xl font-bold text-center mb-2">
//           Reset Password
//         </h2>

//         <p className="text-sm text-gray-500 text-center mb-6">
//           Create a new secure password
//         </p>

//         <form onSubmit={submit} className="space-y-4">

//           <input
//             type="password"
//             placeholder="New password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black"
//           />

//           <input
//             type="password"
//             placeholder="Confirm password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600 text-center">
//               {error}
//             </p>
//           )}

//           {success && (
//             <p className="text-sm text-green-600 text-center">
//               {success}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Updating..." : "Update Password"}
//           </button>

//         </form>
//       </div>
//     </main>
//   );
// }
