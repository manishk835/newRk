"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cooldown, setCooldown] = useState(0); // 🔥 countdown seconds

  /* ================= REDIRECT IF NO PHONE ================= */
  useEffect(() => {
    if (!phone) {
      router.replace("/register");
    }
  }, [phone, router]);

  /* ================= COOLDOWN TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ================= VERIFY OTP ================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter valid 6 digit OTP");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setSuccess("Account verified successfully 🎉");

      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`,
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

      setSuccess("OTP sent again successfully 📩");

      // 🔥 Start 30 sec cooldown
      setCooldown(30);

    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter the 6 digit code sent to your registered email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            className="w-full border px-4 py-3 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 text-center">
              {success}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify OTP"}
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


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function VerifyOtpPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const phone = searchParams.get("phone") || "";

//   const [otp, setOtp] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     if (!phone) {
//       router.replace("/register");
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
//       setSubmitting(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
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

//       setSuccess("Account verified successfully 🎉");

//       setTimeout(() => {
//         router.replace("/login");
//       }, 1500);

//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResend = async () => {
//     try {
//       setResending(true);
//       setError("");
//       setSuccess("");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`,
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

//       setSuccess("OTP sent again successfully");
//     } catch (err: any) {
//       setError(err.message || "Failed to resend OTP");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white border rounded-2xl p-8 shadow-sm w-full max-w-md">

//         <h1 className="text-3xl font-bold text-center mb-2">
//           Verify OTP
//         </h1>

//         <p className="text-center text-gray-500 mb-6">
//           Enter the 6 digit code sent to {phone}
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
//             disabled={submitting}
//             className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {submitting ? "Verifying..." : "Verify OTP"}
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
