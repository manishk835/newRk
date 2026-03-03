import type { Metadata } from "next";
import VendorForm from "./VendorForm";

export const metadata: Metadata = {
  title: "Sell on RK Fashion House",
  description:
    "Join RK Fashion House as a seller. Grow your fashion brand with our trusted marketplace platform.",
};

export default function ForVendorsPage() {
  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-5xl font-extrabold mb-6">
            Sell Your Products Online
          </h1>

          <p className="text-gray-600 text-lg mb-10">
            Reach thousands of customers. Manage products,
            track orders and scale your fashion business with ease.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <Benefit
            title="Easy Product Management"
            desc="Add, edit and manage your catalog with a powerful dashboard."
          />
          <Benefit
            title="Real-Time Order Tracking"
            desc="Stay updated with instant notifications and analytics."
          />
          <Benefit
            title="Secure Payments"
            desc="Receive payments directly and securely."
          />
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Apply to Become a Seller
          </h2>

          <VendorForm />
        </div>
      </section>

    </div>
  );
}

function Benefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}