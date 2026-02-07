"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      } 

      // ✅ SAVE TOKEN (standard key)
      localStorage.setItem("admin_token", data.token);

      router.push("/admin/orders");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4 border p-6 rounded-lg"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       // ✅ SAVE TOKEN
//       localStorage.setItem("adminToken", data.token);

//       router.push("/admin/orders");
//     } catch (err) {
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 pt-28 max-w-md">
//       <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

//       <form
//         onSubmit={handleLogin}
//         className="space-y-4 border p-6 rounded-lg"
//       >
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border px-4 py-2 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border px-4 py-2 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-lg"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
