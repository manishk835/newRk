"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

  const router = useRouter();

  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const validate = () => {

    if (!phone) {
      setError("Enter mobile number");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }

    return true;

  };

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validate()) return;

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSuccess("If the number exists, a reset OTP has been sent 📩");

      setTimeout(() => {

        router.push(`/reset-verify?phone=${phone}`);

      }, 1200);

    } catch (err: any) {

      setError(err.message || "Something went wrong");

    } finally {

      setLoading(false);

    }

  };

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
          Forgot password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered mobile number to receive a reset OTP
        </p>

        <form onSubmit={submit} className="space-y-5">

          <input
            type="tel"
            inputMode="numeric"
            placeholder="Mobile number"
            maxLength={10}
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
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
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>

        </form>

      </div>

    </main>

  );

}

// // app/(auth)/forgot-password/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const router = useRouter();

//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError("Enter valid 10 digit mobile number");
//       return false;
//     }
//     return true;
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ phone }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to send OTP");
//       }

//       setSuccess("If this number exists, OTP has been sent 📩");

//       // Redirect to reset verify page
//       setTimeout(() => {
//         router.push(`/reset-verify?phone=${phone}`);
//       }, 1200);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h2 className="text-xl font-bold text-center">
//           Forgot Password
//         </h2>

//         <p className="text-sm text-gray-500 mt-2 text-center">
//           We will send a reset OTP to your registered email
//         </p>

//         <form onSubmit={submit} className="mt-6 space-y-4">

//           <input
//             type="tel"
//             placeholder="Mobile number"
//             maxLength={10}
//             value={phone}
//             onChange={(e) =>
//               setPhone(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600">
//               {error}
//             </p>
//           )}

//           {success && (
//             <p className="text-sm text-green-600">
//               {success}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Sending OTP..." : "Continue"}
//           </button>

//         </form>

//       </div>
//     </main>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const redirectParam = searchParams.get("redirect") || "/reset-password";

//   // 🔐 prevent open redirect
//   const redirect =
//     redirectParam.startsWith("/") ? redirectParam : "/reset-password";

//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError("Enter valid 10 digit mobile number");
//       return false;
//     }
//     return true;
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ phone }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to send OTP");
//       }

//       // 🔁 Redirect to verify page
//       router.push(
//         `/verify?phone=${phone}&redirect=${encodeURIComponent(
//           redirect
//         )}`
//       );

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h2 className="text-xl font-bold text-center">
//           Forgot Password
//         </h2>

//         <p className="text-sm text-gray-500 mt-2 text-center">
//           We will send an OTP to your registered mobile number
//         </p>

//         <form onSubmit={submit} className="mt-6 space-y-4">

//           <input
//             type="tel"
//             placeholder="Mobile number"
//             maxLength={10}
//             value={phone}
//             onChange={(e) =>
//               setPhone(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600">
//               {error}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Sending OTP..." : "Continue"}
//           </button>

//         </form>

//         <p className="text-xs text-gray-500 mt-6 text-center">
//           Make sure your number is active and accessible.
//         </p>

//       </div>
//     </main>
//   );
// }
