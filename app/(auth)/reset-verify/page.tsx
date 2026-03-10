"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetVerifyPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  /* ================= REDIRECT ================= */

  useEffect(() => {

    if (!phone) {
      router.replace("/forgot-password");
    }

  }, [phone, router]);

  /* ================= TIMER ================= */

  useEffect(() => {

    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [cooldown]);

  /* ================= OTP INPUT ================= */

  const handleChange = (value: string, index: number) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

  };

  const handleKeyDown = (e: any, index: number) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }

  };

  /* ================= VERIFY ================= */

  const handleVerify = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Enter 6 digit OTP");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            otp: code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setSuccess("OTP verified successfully 🎉");

      setTimeout(() => {
        router.push(`/reset-password?phone=${phone}`);
      }, 1200);

    } catch (err: any) {

      setError(err.message || "Verification failed");

    } finally {

      setLoading(false);

    }

  };

  /* ================= RESEND ================= */

  const handleResend = async () => {

    if (cooldown > 0) return;

    try {

      setResending(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setSuccess("OTP sent again 📩");

      setCooldown(30);

    } catch (err: any) {

      setError(err.message || "Failed to resend OTP");

    } finally {

      setResending(false);

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
          Verify Reset OTP
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6 digit code sent to your mobile number
        </p>

        <form onSubmit={handleVerify} className="space-y-6">

          <div className="flex justify-center gap-3">

            {otp.map((digit, index) => (

              <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-12 h-12 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-black"
              />

            ))}

          </div>

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
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="text-center mt-6">

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="text-sm text-black hover:underline disabled:opacity-50"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>

        </div>

      </div>

    </main>

  );

}

// // app/(auth)/reset-verify/page.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ResetVerifyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const phone = searchParams.get("phone") || "";

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);

//   /* ================= REDIRECT SAFETY ================= */
//   useEffect(() => {
//     if (!phone) {
//       router.replace("/forgot-password");
//     }
//   }, [phone, router]);

//   /* ================= VERIFY OTP ================= */
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (otp.length !== 6) {
//       setError("Enter valid 6 digit OTP");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone, otp }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       setSuccess("OTP verified successfully 🎉");

//       setTimeout(() => {
//         router.push(`/reset-password?phone=${phone}`);
//       }, 1200);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RESEND OTP ================= */
//   const handleResend = async () => {
//     try {
//       setResending(true);
//       setError("");
//       setSuccess("");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to resend OTP");
//       }

//       setSuccess("OTP sent again successfully 📩");

//     } catch (err: any) {
//       setError(err.message || "Failed to resend OTP");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h1 className="text-2xl font-bold text-center mb-2">
//           Verify Reset OTP
//         </h1>

//         <p className="text-center text-gray-500 mb-6">
//           Enter the OTP sent to your email
//         </p>

//         <form onSubmit={handleVerify} className="space-y-4">

//           <input
//             type="text"
//             placeholder="Enter 6 digit OTP"
//             value={otp}
//             maxLength={6}
//             onChange={(e) =>
//               setOtp(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-full border px-4 py-3 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600">{error}</p>
//           )}

//           {success && (
//             <p className="text-sm text-green-600">{success}</p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>

//         </form>

//         <div className="text-center mt-4">
//           <button
//             onClick={handleResend}
//             disabled={resending}
//             className="text-sm text-black hover:underline disabled:opacity-50"
//           >
//             {resending ? "Sending..." : "Resend OTP"}
//           </button>
//         </div>

//       </div>
//     </main>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ResetVerifyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const phone = searchParams.get("phone") || "";

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!phone) {
//       router.replace("/forgot-password");
//     }
//   }, [phone, router]);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (otp.length !== 6) {
//       setError("Enter valid 6 digit OTP");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone, otp }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       setSuccess("OTP verified successfully");

//       setTimeout(() => {
//         router.push(`/reset-password?phone=${phone}`);
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

//         <h1 className="text-2xl font-bold text-center mb-2">
//           Verify Reset OTP
//         </h1>

//         <p className="text-center text-gray-500 mb-6">
//           Enter the OTP sent to your email
//         </p>

//         <form onSubmit={handleVerify} className="space-y-4">

//           <input
//             type="text"
//             placeholder="Enter 6 digit OTP"
//             value={otp}
//             maxLength={6}
//             onChange={(e) =>
//               setOtp(e.target.value.replace(/\D/g, ""))
//             }
//             className="w-full border px-4 py-3 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-black"
//           />

//           {error && (
//             <p className="text-sm text-red-600">{error}</p>
//           )}

//           {success && (
//             <p className="text-sm text-green-600">{success}</p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>

//         </form>

//       </div>
//     </main>
//   );
// }
