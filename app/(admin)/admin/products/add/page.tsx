import { redirect } from "next/navigation";

export default function AddProductRedirect() {
  redirect("/admin/products/create");
}