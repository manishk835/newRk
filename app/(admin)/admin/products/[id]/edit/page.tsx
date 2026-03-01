"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductRedirect() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/admin/products/${id}`);
    }
  }, [id, router]);

  return null;
}
