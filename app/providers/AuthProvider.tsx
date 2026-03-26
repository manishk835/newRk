"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  sellerStatus?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ================= */

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          credentials: "include",
          cache: "no-store", // ✅ IMPORTANT
        }
      );

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);

    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchUser();
  }, []);

  /* ================= AUTO REFRESH ON FOCUS ================= */

  useEffect(() => {
    const handleFocus = () => {
      fetchUser(); // 🔥 tab change / reload pe update
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  /* ================= SELLER AUTO UPDATE ================= */

  useEffect(() => {
    if (!user) return;

    if (user.sellerStatus === "pending") {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
              credentials: "include",
              cache: "no-store",
            }
          );

          if (!res.ok) return;

          const data = await res.json();

          if (data.sellerStatus === "approved") {
            setUser(data);
            window.location.href = "/seller";
          }

        } catch {}

      }, 4000);

      return () => clearInterval(interval);
    }

  }, [user]);

  /* ================= LOGOUT ================= */

  const logout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {}

    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("AuthProvider missing");
  }

  return ctx;
};

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type User = {
//   _id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   role: string;
//   sellerStatus?: string; // 🔥 add this
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH USER ================= */

//   const fetchUser = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         setUser(null);
//         return;
//       }

//       const data = await res.json();
//       setUser(data);

//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   /* ================= AUTO SELLER UPDATE ================= */

//   useEffect(() => {
//     if (!user) return;

//     // 🔥 sirf pending users ke liye check kare
//     if (user.sellerStatus === "pending") {

//       const interval = setInterval(async () => {
//         try {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//             { credentials: "include" }
//           );

//           if (!res.ok) return;

//           const data = await res.json();

//           // 🔥 approved ho gaya → auto update
//           if (data.sellerStatus === "approved") {
//             setUser(data);

//             // 🔥 redirect seller panel
//             window.location.href = "/seller";
//           }

//         } catch {}

//       }, 4000); // 4 sec polling

//       return () => clearInterval(interval);
//     }

//   }, [user]);

//   /* ================= LOGOUT ================= */

//   const logout = async () => {
//     try {
//       await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
//         {
//           method: "POST",
//           credentials: "include",
//         }
//       );
//     } catch {}

//     setUser(null);
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         refreshUser: fetchUser,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error("AuthProvider missing");
//   }

//   return ctx;
// };

// // // app/providers/AuthProvider.tsx

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type User = {
//   _id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   role: string;
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {

//     try {

//       setLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         setUser(null);
//         return;
//       }

//       const data = await res.json();

//       setUser(data);

//     } catch {

//       setUser(null);

//     } finally {

//       setLoading(false);

//     }

//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const logout = async () => {

//     try {

//       await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
//         {
//           method: "POST",
//           credentials: "include",
//         }
//       );

//     } catch {}

//     setUser(null);

//     window.location.href = "/login";

//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         refreshUser: fetchUser,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );

// }

// export const useAuth = () => {

//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error("AuthProvider missing");
//   }

//   return ctx;

// };
