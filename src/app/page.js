"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-[85vh] w-full bg-white flex flex-col lg:flex-row">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full flex-1">
        {/* Left Column (Text Content) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-24 xl:px-32"
        >
          <h1 className="text-[#0f284f] text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-tight mb-6">
            ROOM TO REMEMBER
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
            Discover a world of comfort, luxury, and unparalleled hospitality at
            Hoteller. Nestled in the heart of city, our exquisite hotel is your
            home away from home, where every stay is a memorable experience.
          </p>
          <div>
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-[#0f284f] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-[#1a3d72] transition-colors"
            >
              BOOK YOUR STAY NOW
            </Link>
          </div>
        </motion.div>

        {/* Right Column (Image) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[50vh] lg:h-full min-h-[400px] lg:min-h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1618773928120-2c14230171bd?q=80&w=2070"
            alt="Premium Hotel Bedroom"
            className="w-full h-full object-cover absolute inset-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
