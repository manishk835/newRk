"use client";

import VendorForm from "./VendorForm";
import { useAuth } from "@/app/providers/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForVendorsPage() {

  const { user, loading } = useAuth();
  const router = useRouter();

  /* ================= AUTO REDIRECT ================= */

  useEffect(() => {
    if (!loading && user?.sellerStatus === "approved") {
      router.replace("/seller");
    }
  }, [user, loading, router]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <section className="pt-32 pb-24 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-6">
            Sell on <span className="text-[#F5A623]">RK Fashion</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Join hundreds of fashion brands already selling on RK Fashion.
            Reach customers across India and grow your business faster.
          </p>

          <a
            href="#apply"
            className="inline-block bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Start Selling
          </a>

        </div>
      </section>

      {/* ================= IF ALREADY APPLIED ================= */}

      {user?.sellerStatus === "pending" && (
        <div className="max-w-xl mx-auto mt-10 bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl text-center">
          Your application is under review. Please wait for approval.
        </div>
      )}

      {/* ================= FORM ================= */}

      {(!user || user.sellerStatus !== "pending") && (

        <section
          id="apply"
          className="py-24 bg-white border-t"
        >
          <div className="max-w-2xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-center mb-10">
              Apply to Become a Seller
            </h2>

            <VendorForm />

          </div>
        </section>

      )}

    </div>
  );
}

// // 📄 app/(public)/for-vendors/page.tsx

// import VendorForm from "./VendorForm";

// export default function ForVendorsPage() {

//   return (
//     <div className="bg-gray-50">

//       {/* HERO */}

//       <section className="pt-32 pb-24 bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 text-center">

//           <h1 className="text-5xl font-bold mb-6">
//             Sell on <span className="text-[#F5A623]">RK Fashion</span>
//           </h1>

//           <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
//             Join hundreds of fashion brands already selling on RK Fashion.
//             Reach customers across India and grow your business faster.
//           </p>

//           <a
//             href="#apply"
//             className="inline-block bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
//           >
//             Start Selling
//           </a>

//         </div>
//       </section>


//       {/* TRUST STATS */}

//       <section className="py-16 bg-gray-50 border-b">
//         <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

//           <Stat title="10k+" desc="Customers" />
//           <Stat title="500+" desc="Products Sold" />
//           <Stat title="100+" desc="Active Sellers" />
//           <Stat title="24/7" desc="Seller Support" />

//         </div>
//       </section>


//       {/* BENEFITS */}

//       <section className="py-24 bg-white">

//         <div className="max-w-6xl mx-auto px-6">

//           <h2 className="text-3xl font-bold text-center mb-14">
//             Why Sell With Us
//           </h2>

//           <div className="grid md:grid-cols-3 gap-10">

//             <Benefit
//               title="Reach Thousands"
//               desc="Your products reach customers across India instantly through our marketplace."
//             />

//             <Benefit
//               title="Easy Seller Dashboard"
//               desc="Manage products, inventory, orders and earnings from a powerful dashboard."
//             />

//             <Benefit
//               title="Secure Payments"
//               desc="Receive payments directly to your seller wallet with transparent earnings."
//             />

//           </div>

//         </div>

//       </section>


//       {/* HOW IT WORKS */}

//       <section className="py-24 bg-gray-50 border-t">

//         <div className="max-w-6xl mx-auto px-6">

//           <h2 className="text-3xl font-bold text-center mb-16">
//             How It Works
//           </h2>

//           <div className="grid md:grid-cols-3 gap-10 text-center">

//             <Step
//               number="1"
//               title="Apply"
//               desc="Submit your seller application with your brand details."
//             />

//             <Step
//               number="2"
//               title="Get Approved"
//               desc="Our team reviews your application and approves your store."
//             />

//             <Step
//               number="3"
//               title="Start Selling"
//               desc="Add products, manage orders and start earning."
//             />

//           </div>

//         </div>

//       </section>


//       {/* APPLICATION FORM */}

//       <section
//         id="apply"
//         className="py-24 bg-white border-t"
//       >

//         <div className="max-w-2xl mx-auto px-6">

//           <h2 className="text-3xl font-bold text-center mb-10">
//             Apply to Become a Seller
//           </h2>

//           <VendorForm />

//         </div>

//       </section>

//     </div>
//   );

// }


// /* ================= COMPONENTS ================= */


// function Benefit({
//   title,
//   desc,
// }: {
//   title: string;
//   desc: string;
// }) {

//   return (

//     <div className="bg-white p-8 rounded-2xl border shadow-sm text-center">

//       <h3 className="font-semibold text-xl mb-3">
//         {title}
//       </h3>

//       <p className="text-gray-600">
//         {desc}
//       </p>

//     </div>

//   );

// }


// function Step({
//   number,
//   title,
//   desc,
// }: {
//   number: string;
//   title: string;
//   desc: string;
// }) {

//   return (

//     <div className="bg-white p-8 rounded-2xl border shadow-sm">

//       <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-black text-white font-bold">
//         {number}
//       </div>

//       <h3 className="font-semibold text-lg mb-2">
//         {title}
//       </h3>

//       <p className="text-gray-600 text-sm">
//         {desc}
//       </p>

//     </div>

//   );

// }


// function Stat({
//   title,
//   desc,
// }: {
//   title: string;
//   desc: string;
// }) {

//   return (

//     <div>

//       <div className="text-2xl font-bold">
//         {title}
//       </div>

//       <div className="text-sm text-gray-500">
//         {desc}
//       </div>

//     </div>

//   );

// }
