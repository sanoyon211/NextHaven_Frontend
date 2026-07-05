"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    toast.success("Payment processed successfully!");
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8 md:p-12 text-center border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#0f284f] uppercase tracking-wider mb-4">
          Booking Confirmed
        </h1>
        
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          Thank you for choosing NextHaven. Your payment was successful, and your premium suite has been reserved. A confirmation email is on its way.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-block w-full sm:w-auto bg-[#0f284f] text-white font-bold uppercase tracking-wider px-10 py-4 rounded-sm hover:bg-[#1a3d72] transition-colors"
        >
          View My Bookings
        </Link>
      </motion.div>
    </main>
  );
}
