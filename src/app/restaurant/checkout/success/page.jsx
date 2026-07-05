"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (sessionId && !cleared) {
      localStorage.removeItem("foodCart");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCleared(true);
    }
  }, [sessionId, cleared]);

  return (
    <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 max-w-lg w-full text-center">
      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider mb-4">
        Payment Successful
      </h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Thank you for your order! Your payment has been processed successfully.
        Your food is now being prepared.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors flex justify-center items-center gap-2"
        >
          View My Orders <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.push("/restaurant/all-menu")}
          className="w-full bg-white text-[#0f284f] border border-[#0f284f] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gray-50 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 flex flex-col items-center justify-center">
      <Suspense fallback={
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 max-w-lg w-full text-center animate-pulse">
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-14 bg-gray-200 rounded-sm w-full"></div>
            <div className="h-14 bg-gray-100 rounded-sm w-full"></div>
          </div>
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
