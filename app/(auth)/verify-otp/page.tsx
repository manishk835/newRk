"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const identifier = searchParams.get("identifier") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [error, setError] = useState("");

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  /* ================= REDIRECT ================= */
  useEffect(() => {
    if (!identifier) {
      router.replace("/login");
    }
  }, [identifier, router]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ================= INPUT ================= */
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

    const code = otp.join("");

    if (code.length !== 6) {
      return setError("Enter 6 digit OTP");
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            phone: identifier, // ✅ FIXED
            otp: code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      router.replace("/");

    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RESEND ================= */
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, // ✅ FIXED
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: identifier, // ✅ FIXED
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setCooldown(30);

    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="mt-6 mb-4 text-xl font-semibold">
        RKFashion
      </div>

      <div className="w-full max-w-xs border rounded-lg p-6">
        <h1 className="text-lg font-medium mb-3">
          Verify your account
        </h1>

        <p className="text-xs text-gray-600 mb-4">
          Enter OTP sent to{" "}
          <span className="font-medium">{identifier}</span>
        </p>

        <form onSubmit={handleVerify}>
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-10 h-10 border text-center rounded focus:ring-2 focus:ring-yellow-500"
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-3">
              {error}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-yellow-300 py-1.5 rounded text-sm font-medium"
          >
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-xs">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-blue-600 disabled:opacity-50"
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </main>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function VerifyOtpPage() {

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const identifier = searchParams.get("identifier") || "";

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [submitting, setSubmitting] = useState(false);
//   const [cooldown, setCooldown] = useState(30);
//   const [error, setError] = useState("");

//   const inputs = useRef<(HTMLInputElement | null)[]>([]);

//   /* ================= REDIRECT ================= */
//   useEffect(() => {
//     if (!identifier) {
//       router.replace("/login");
//     }
//   }, [identifier, router]);

//   /* ================= TIMER ================= */
//   useEffect(() => {
//     if (cooldown <= 0) return;

//     const timer = setInterval(() => {
//       setCooldown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [cooldown]);

//   /* ================= INPUT ================= */
//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: any, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   /* ================= VERIFY ================= */
//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const code = otp.join("");

//     if (code.length !== 6) {
//       setError("Enter 6 digit OTP");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError("");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             identifier,
//             otp: code,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Invalid or expired OTP");
//       }

//       // ✅ success → login
//       router.replace("/");

//     } catch (err: any) {
//       setError(err.message || "Verification failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= RESEND ================= */
//   const handleResend = async () => {
//     if (cooldown > 0) return;

//     try {
//       setError("");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ identifier }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to resend OTP");
//       }

//       setCooldown(30);

//     } catch (err: any) {
//       setError(err.message || "Failed to resend OTP");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-white flex flex-col items-center">

//       {/* LOGO */}
//       <div className="mt-6 mb-4 text-xl font-semibold tracking-wide">
//         RKFashion
//       </div>

//       {/* CARD */}
//       <div className="w-full max-w-xs border border-gray-300 rounded-lg p-6">

//         <h1 className="text-lg font-medium mb-3">
//           Verify your account
//         </h1>

//         <p className="text-xs text-gray-600 mb-4">
//           Enter the OTP sent to{" "}
//           <span className="font-medium">{identifier}</span>
//         </p>

//         <form onSubmit={handleVerify}>

//           {/* OTP INPUTS */}
//           <div className="flex justify-between mb-4">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => {
//                   inputs.current[index] = el;
//                 }}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) =>
//                   handleChange(e.target.value, index)
//                 }
//                 onKeyDown={(e) =>
//                   handleKeyDown(e, index)
//                 }
//                 className="w-10 h-10 border border-gray-300 text-center text-lg rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               />
//             ))}

//           </div>

//           {error && (
//             <p className="text-xs text-red-500 mb-3">
//               {error}
//             </p>
//           )}

//           {/* VERIFY BUTTON */}
//           <button
//             disabled={submitting}
//             className="w-full bg-yellow-300 hover:bg-yellow-400 text-black py-1.7 rounded text-[13px] font-medium disabled:opacity-60"
//           >
//             {submitting ? "Verifying..." : "Verify OTP"}
//           </button>

//         </form>

//         {/* RESEND */}
//         <div className="mt-4 text-xs">

//           <button
//             onClick={handleResend}
//             disabled={cooldown > 0}
//             className="text-blue-600 hover:underline disabled:opacity-50"
//           >
//             {cooldown > 0
//               ? `Resend OTP in ${cooldown}s`
//               : "Resend OTP"}
//           </button>

//         </div>

//       </div>

//     </main>
//   );
// }