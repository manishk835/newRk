import { redirect } from "next/navigation";

export default function AddProductRedirect() {
  redirect("/admin/products/create");
}
// // // app/admin/products/add/page.tsx

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function AddProductRedirect() {
//   const router = useRouter();

//   useEffect(() => {
//     router.replace("/admin/products/create");
//   }, [router]);

//   return null;
// }
