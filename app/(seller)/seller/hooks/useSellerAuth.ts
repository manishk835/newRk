"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type User = {
  role: string;
  sellerStatus?: string;
  name?: string;
};

export default function useSellerAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const isLoginPage = pathname === "/login";

  const checkAuth = useCallback(async () => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    try {
      const res = await apiFetch("/auth/me");
      const u: User = res.user || res.admin || res;

      if (!u) {
        router.replace("/login");
        return;
      }

      if (u.sellerStatus !== "approved") {
        router.replace("/for-vendors");
        return;
      }

      setUser(u);
    } catch {
      router.replace("/login");
    } finally {
      setCheckingAuth(false);
    }
  }, [router, isLoginPage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, checkingAuth };
}