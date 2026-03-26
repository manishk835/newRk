"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // ✅ redirect if logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // ✅ cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ✅ secure fetch with timeout
  const safeFetch = async (url: string, options: any, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw new Error("Network timeout. Try again.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔒 validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return setError("Enter valid mobile number");
    }

    if (!name.trim() || name.length < 3) {
      return setError("Enter valid name");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setSubmitting(true);

      const res = await safeFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            phone,
            password,
          }),
        }
      );

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      // ✅ prevent spam
      setCooldown(30);

      // ✅ store temp identifier
      sessionStorage.setItem("verify_phone", phone);

      router.push(`/verify-otp?identifier=${phone}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="mt-6 mb-4 text-xl font-semibold tracking-wide">
        RKFashion
      </div>

      <div className="w-full max-w-xs border border-gray-300 rounded-lg p-6">
        <h1 className="text-lg font-medium mb-4">Create Account</h1>

        <form onSubmit={submit}>
          {/* BOT TRAP */}
          <input
            type="text"
            style={{ display: "none" }}
            autoComplete="off"
            tabIndex={-1}
          />

          {/* PHONE */}
          <label className="text-sm font-medium">Mobile number</label>

          <div className="flex gap-2 mt-1 mb-3">
            <div className="border px-3 py-1.5 bg-gray-100 rounded text-sm">
              +91
            </div>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              className="flex-1 border px-3 py-1.5 rounded text-sm focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* NAME */}
          <label className="text-sm font-medium">Your name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 mb-3 px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-yellow-500"
          />

          {/* PASSWORD */}
          <label className="text-sm font-medium">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-1 px-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-yellow-500"
          />

          <p className="text-xs text-gray-600 mb-3">
            Password must be at least 6 characters.
          </p>

          {/* ERROR */}
          {error && (
            <p className="text-xs text-red-500 mb-3">{error}</p>
          )}

          {/* BUTTON */}
          <button
            disabled={submitting || cooldown > 0}
            className="w-full bg-yellow-300 hover:bg-yellow-400 py-1.5 rounded text-sm font-medium disabled:opacity-60"
          >
            {submitting
              ? "Sending OTP..."
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Verify mobile number"}
          </button>
        </form>

        <div className="mt-4 border-t pt-3 text-xs">
          Already a customer?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Sign in instead
          </button>
        </div>

        <p className="text-[11px] text-gray-500 mt-3">
          By creating an account, you agree to RKFashion's terms.
        </p>
      </div>
    </main>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/providers/AuthProvider";

// export default function RegisterPage() {

//   const router = useRouter();
//   const { user, loading } = useAuth();

//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [cooldown, setCooldown] = useState(0);

//   // 🧠 Redirect if already logged in
//   useEffect(() => {
//     if (!loading && user) {
//       router.replace("/");
//     }
//   }, [user, loading, router]);

//   // ⏳ Cooldown timer
//   useEffect(() => {
//     if (cooldown <= 0) return;

//     const timer = setInterval(() => {
//       setCooldown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [cooldown]);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // 🔒 Validation
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       setError("Enter valid mobile number");
//       return;
//     }

//     if (!name.trim()) {
//       setError("Enter your name");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

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

//       // ⏳ prevent spam
//       setCooldown(30);

//       router.push(`/verify-otp?identifier=${phone}`);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return null;

//   return (
//     <main className="min-h-screen bg-white flex flex-col items-center">

//       {/* LOGO */}
//       <div className="mt-6 mb-4 text-xl font-semibold tracking-wide">
//         RKFashion
//       </div>

//       {/* CARD */}
//       <div className="w-full max-w-xs border border-gray-300 rounded-lg p-6">

//         <h1 className="text-lg font-medium mb-4">
//           Create Account
//         </h1>

//         <form onSubmit={submit}>

//           {/* 🛑 BOT TRAP */}
//           <input type="text" style={{ display: "none" }} autoComplete="off" />

//           {/* PHONE */}
//           <label className="text-sm font-medium">
//             Mobile number
//           </label>

//           <div className="flex gap-2 mt-1 mb-3">
//             <div className="border border-gray-300 px-3 py-1.75 bg-gray-100 rounded text-sm">
//               +91
//             </div>

//             <input
//               type="tel"
//               placeholder="Mobile number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="flex-1 border border-gray-300 px-3 py-1.75 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             />
//           </div>

//           {/* NAME */}
//           <label className="text-sm font-medium">
//             Your name
//           </label>

//           <input
//             type="text"
//             placeholder="First and last name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full mt-1 mb-3 px-3 py-1.75 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//           />

//           {/* PASSWORD */}
//           <label className="text-sm font-medium">
//             Password
//           </label>

//           <input
//             type="password"
//             placeholder="At least 6 characters"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full mt-1 mb-1 px-3 py-1.75 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
//           />

//           <p className="text-xs text-gray-600 mb-3">
//             Password must be at least 6 characters.
//           </p>

//           {/* ERROR */}
//           {error && (
//             <p className="text-xs text-red-500 mb-3">
//               {error}
//             </p>
//           )}

//           {/* BUTTON */}
//           <button
//             disabled={submitting || cooldown > 0}
//             className="w-full bg-yellow-300 hover:bg-yellow-400 text-black py-1.75 rounded text-[13px] font-medium disabled:opacity-60"
//           >
//             {submitting
//               ? "Sending OTP..."
//               : cooldown > 0
//               ? `Wait ${cooldown}s`
//               : "Verify mobile number"}
//           </button>

//         </form>

//         {/* LOGIN */}
//         <div className="mt-4 border-t pt-3 text-xs">
//           Already a customer?{" "}
//           <button
//             onClick={() => router.push("/login")}
//             className="text-blue-600 hover:underline"
//           >
//             Sign in instead
//           </button>
//         </div>

//         {/* TERMS */}
//         <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
//           By creating an account, you agree to RKFashion's{" "}
//           <span className="text-blue-600">Conditions of Use</span>{" "}
//           and{" "}
//           <span className="text-blue-600">Privacy Policy</span>.
//         </p>

//       </div>

//     </main>
//   );
// }