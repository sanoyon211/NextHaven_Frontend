"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="w-full bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[85vh]">
        {/* Left Column (Text Content) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center p-4 md:p-8 lg:p-16"
        >
          <h1 className="text-[#0f284f] text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6">
            ROOM TO REMEMBER
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
            Discover a world of comfort, luxury, and unparalleled hospitality at
            Hoteller. Nestled in the heart of city, our exquisite hotel is your
            home away from home, where every stay is a memorable experience.
          </p>
          <div>
            <Link
              href="/rooms"
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
          className="relative w-full h-[50vh] lg:h-auto min-h-[400px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"
            alt="Premium Hotel Bedroom"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
      </section>

      {/* Booking Bar and Room Grid */}
      <section className="bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-7xl">
          {/* Booking Bar Title */}
          <div className="text-center mb-10">
            <h2 className="text-[#0f284f] text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Book Your Stay
            </h2>
          </div>

          {/* Booking Bar Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-20 max-w-5xl mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Check-in</label>
                <input type="date" className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Check-out</label>
                <input type="date" className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Adults</label>
                <select className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f] bg-white">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Children</label>
                <select className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f] bg-white">
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                </select>
              </div>
              <button type="submit" className="bg-[#0f284f] text-white font-bold uppercase tracking-wider p-3 rounded hover:bg-[#1a3d72] transition-colors h-[46px]">
                Search
              </button>
            </form>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "STANDARD ROOM",
                price: "$59",
                details: "27 m2 / 2 adults 1 children",
                image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"
              },
              {
                title: "SUPERIOR ROOM",
                price: "$79",
                details: "32 m2 / 2 adults 2 children",
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000"
              },
              {
                title: "DELUXE ROOM",
                price: "$129",
                details: "45 m2 / 3 adults 2 children",
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
              },
              {
                title: "EXECUTIVE SUITE",
                price: "$199",
                details: "65 m2 / 4 adults 2 children",
                image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2000"
              }
            ].map((room, idx) => (
              <Link key={idx} href="/rooms">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white shadow-md rounded-lg overflow-hidden group cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[#0f284f] font-bold uppercase text-lg mb-2">
                      {room.title}
                    </h3>
                    <div className="flex justify-between items-end mt-6">
                      <p className="text-gray-500 text-xs w-1/2 leading-relaxed">{room.details}</p>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">From</p>
                        <p className="text-2xl font-extrabold text-[#0f284f]">{room.price}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
