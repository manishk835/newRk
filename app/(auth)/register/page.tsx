"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✅ NEW
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your full name");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter valid email address");
      return false;
    }

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email, // ✅ SEND EMAIL
            phone,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ Redirect to OTP page
      router.push(`/verify-otp?phone=${phone}`);

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
          Create your account
        </p>

        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="tel"
            placeholder="Mobile number"
            value={phone}
            maxLength={10}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {submitting ? "Sending OTP..." : "Create Account"}
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/providers/AuthProvider";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!loading && user) {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   const validate = () => {
//     if (!name.trim()) {
//       setError("Please enter your full name");
//       return false;
//     }

//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError("Enter valid 10 digit mobile number");
//       return false;
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return false;
//     }

//     return true;
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!validate()) return;

//     try {
//       setSubmitting(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: name.trim(),
//             phone,
//             password,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       // 🔥 IMPORTANT: Redirect to OTP verification
//       router.push(`/verify-otp?phone=${phone}`);

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
//           Create your account
//         </p>

//         <form onSubmit={submit} className="space-y-4">

//           <input
//             type="text"
//             placeholder="Full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

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
//             placeholder="Create password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
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
//             {submitting ? "Sending OTP..." : "Create Account"}
//           </button>

//         </form>

//         <p className="text-sm text-center mt-4">
//           Already have an account?{" "}
//           <Link href="/login" className="font-semibold hover:underline">
//             Sign in
//           </Link>
//         </p>

//       </div>
//     </main>
//   );
// }