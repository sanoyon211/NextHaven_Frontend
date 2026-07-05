"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc] px-4 py-10 md:py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[#0f284f] text-[120px] sm:text-[150px] font-black uppercase tracking-tighter leading-none drop-shadow-sm">
            404
          </h1>
          <div className="w-24 h-1 bg-[#ffbca8] mx-auto my-8"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-widest mb-6">
            Lost in Luxury
          </h2>
          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            The page you are looking for has checked out, or perhaps never
            existed. Let us guide you back to the comfort of our main lobby.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#0f284f] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a3d72] transition-colors flex items-center justify-center gap-3 group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-[#0f284f] transition-all flex items-center justify-center gap-3 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
