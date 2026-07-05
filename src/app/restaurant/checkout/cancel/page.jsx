"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 max-w-lg w-full text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your payment was cancelled. No charges were made. You can return to
          the checkout page when you are ready.
        </p>
        <button
          onClick={() => router.push("/restaurant/checkout")}
          className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors flex justify-center items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Checkout
        </button>
      </div>
    </div>
  );
}
