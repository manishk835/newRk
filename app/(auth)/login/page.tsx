"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const redirectParam = searchParams.get("redirect") || "/";
  const redirect =
    redirectParam.startsWith("/") ? redirectParam : "/";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ================= AUTO REDIRECT IF LOGGED IN ================= */
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [user, loading, router, redirect]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter valid 10 digit mobile number");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // 🔐 Not verified → go to OTP
        if (data.message === "Please verify your phone first") {
          router.push(`/verify-otp?phone=${phone}`);
          return;
        }

        // 🔒 Locked account
        if (data.message?.includes("locked")) {
          setError("Account temporarily locked. Try again later.");
          return;
        }

        throw new Error(data.message || "Login failed");
      }

      router.replace(redirect);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          RK<span className="text-[#F5A623]">Fashion</span>
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={submit} className="space-y-4">

          <input
            type="tel"
            placeholder="Mobile number"
            value={phone}
            maxLength={10}
            disabled={submitting}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={submitting}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60 transition"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="flex justify-between text-sm mt-4">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-black hover:underline"
          >
            Forgot password?
          </button>

          <button
            onClick={() => router.push("/register")}
            className="text-black hover:underline"
          >
            Create account
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          By signing in, you agree to our Terms & Privacy Policy.
        </p>

      </div>
    </main>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/app/providers/AuthProvider";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, loading } = useAuth();

//   const redirectParam = searchParams.get("redirect") || "/";
//   const redirect =
//     redirectParam.startsWith("/") ? redirectParam : "/";

//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   /* ================= AUTO REDIRECT IF LOGGED IN ================= */
//   useEffect(() => {
//     if (!loading && user) {
//       router.replace(redirect);
//     }
//   }, [user, loading, router, redirect]);

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError("Enter valid 10 digit mobile number");
//       return false;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return false;
//     }

//     return true;
//   };

//   /* ================= SUBMIT ================= */
//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!validate()) return;

//     try {
//       setSubmitting(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ phone, password }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         // 🔥 If phone not verified → redirect to OTP page
//         if (data.message === "Please verify your phone first") {
//           router.push(`/verify-otp?phone=${phone}`);
//           return;
//         }

//         throw new Error(data.message || "Login failed");
//       }

//       router.replace(redirect);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return null;

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h1 className="text-3xl font-bold text-center mb-2">
//           RK<span className="text-[#F5A623]">Fashion</span>
//         </h1>

//         <p className="text-center text-gray-500 mb-6">
//           Sign in to your account
//         </p>

//         <form onSubmit={submit} className="space-y-4">

//           <input
//             type="tel"
//             placeholder="Mobile number"
//             value={phone}
//             maxLength={10}
//             onChange={(e) =>
//               setPhone(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600">
//               {error}
//             </p>
//           )}

//           <button
//             disabled={submitting}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {submitting ? "Signing in..." : "Sign In"}
//           </button>

//         </form>

//         <div className="flex justify-between text-sm mt-4">
//           <button
//             onClick={() => router.push("/forgot-password")}
//             className="text-black hover:underline"
//           >
//             Forgot password?
//           </button>

//           <button
//             onClick={() => router.push("/register")}
//             className="text-black hover:underline"
//           >
//             Create account
//           </button>
//         </div>

//         <p className="text-xs text-gray-500 mt-6 text-center">
//           By signing in, you agree to our Terms & Privacy Policy.
//         </p>
//       </div>
//     </main>
//   );
// }