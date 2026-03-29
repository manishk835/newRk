"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";

type FormState = {
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
};

export default function VendorForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    businessName: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.businessName.trim()) return "Business name is required";

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Valid email required";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      return "Valid phone number required";

    if (!form.businessType.trim())
      return "Business type is required";

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!user) {
      router.push("/login?redirect=/for-vendors");
      return;
    }

    if (user.sellerStatus === "approved") {
      router.push("/seller");
      return;
    }

    if (user.sellerStatus === "pending") {
      setError("Your application is already under review");
      return;
    }

    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/vendors/apply", {
        method: "POST",
        body: JSON.stringify(form), // 🔥 full form भेज रहे
      });

      setSuccess(true);

      setForm({
        businessName: "",
        email: "",
        phone: "",
        businessType: "",
        message: "",
      });

    } catch (err: any) {
      const message = err?.message || "";

      if (message.toLowerCase().includes("already")) {
        setSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border p-8 rounded-2xl shadow-sm"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-lg">
          {error}
        </div>
      )}

      <Input label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} />

      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />

      <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />

      <Input label="Business Type" name="businessType" value={form.businessType} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium mb-2">
          Tell us about your brand
        </label>
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-xl font-semibold"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {success && (
        <div className="bg-green-50 border text-green-700 p-4 rounded">
          Application submitted successfully
        </div>
      )}
    </form>
  );
}

function Input({ label, name, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border px-4 py-3 rounded"
      />
    </div>
  );
}


// // 📄 app/(public)/for-vendors/VendorForm.tsx

 
// "use client";

// import { useState } from "react";
// import { apiFetch } from "@/lib/api/client";
// import { useAuth } from "@/app/providers/AuthProvider";
// import { useRouter } from "next/navigation";

// type FormState = {
//   businessName: string;
//   email: string;
//   phone: string;
//   category: string;
//   message: string;
// };

// export default function VendorForm() {

//   const { user } = useAuth();
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState<FormState>({
//     businessName: "",
//     email: "",
//     phone: "",
//     category: "",
//     message: "",
//   });

//   /* ================= HANDLE INPUT ================= */

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   /* ================= VALIDATION ================= */

//   const validate = () => {

//     if (!form.businessName.trim()) return "Business name is required";

//     if (!/^\S+@\S+\.\S+$/.test(form.email))
//       return "Valid email required";

//     if (!/^[6-9]\d{9}$/.test(form.phone))
//       return "Valid phone number required";

//     if (!form.category.trim()) return "Product category is required";

//     return "";
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {

//     e.preventDefault();

//     setError("");
//     setSuccess(false);

//     // 🔥 LOGIN REQUIRED
//     if (!user) {
//       router.push("/login?redirect=/for-vendors");
//       return;
//     }

//     // 🔥 ALREADY SELLER
//     if (user.sellerStatus === "approved") {
//       router.push("/seller");
//       return;
//     }

//     // 🔥 PENDING
//     if (user.sellerStatus === "pending") {
//       setError("Your application is already under review");
//       return;
//     }

//     const validation = validate();

//     if (validation) {
//       setError(validation);
//       return;
//     }

//     try {

//       setLoading(true);

//       // await apiFetch("/api/vendors/apply", {
//       //   method: "POST",
//       //   body: JSON.stringify(form),
//       // });
//       await apiFetch("/vendors/apply", {
//         method: "POST",
//         credentials: "include",
//         body: JSON.stringify({
//           businessName: form.businessName,
//           phone: form.phone,
//           businessType: form.category, // 🔥 यही fix है
//           message: form.message,
//         }),
//       });

//       setSuccess(true);

//       setForm({
//         businessName: "",
//         email: "",
//         phone: "",
//         category: "",
//         message: "",
//       });

//     } catch (err: any) {

//       const message = err?.message || "";

//       if (message.includes("already")) {
//         setSuccess(true);
//       } else {
//         setError("Something went wrong. Please try again.");
//       }

//     } finally {
//       setLoading(false);
//     }

//   };

//   return (

//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 bg-white border p-8 rounded-2xl shadow-sm"
//     >

//       {/* ERROR */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* INPUTS */}

//       <Input
//         label="Business Name"
//         name="businessName"
//         value={form.businessName}
//         onChange={handleChange}
//       />

//       <Input
//         label="Business Email"
//         name="email"
//         type="email"
//         value={form.email}
//         onChange={handleChange}
//       />

//       <Input
//         label="Phone Number"
//         name="phone"
//         value={form.phone}
//         onChange={handleChange}
//       />

//       <Input
//         label="Product Category"
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//       />

//       {/* MESSAGE */}

//       <div>
//         <label className="block text-sm font-medium mb-2">
//           Tell us about your brand
//         </label>

//         <textarea
//           name="message"
//           rows={4}
//           value={form.message}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* BUTTON */}

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
//       >
//         {loading ? "Submitting..." : "Submit Application"}
//       </button>

//       {/* SUCCESS */}

//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-5 rounded-xl text-center">
//           <p className="font-semibold mb-1">
//             Application received
//           </p>
//           <p>
//             Our team is reviewing your vendor application.
//             We will contact you soon.
//           </p>
//         </div>
//       )}

//     </form>

//   );

// }

// /* ================= INPUT ================= */

// function Input({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
// }: {
//   label: string;
//   name: string;
//   type?: string;
//   value: string;
//   onChange: any;
// }) {

//   return (
//     <div>
//       <label className="block text-sm font-medium mb-2">
//         {label}
//       </label>

//       <input
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         required
//         className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
//       />
//     </div>
//   );
// }
