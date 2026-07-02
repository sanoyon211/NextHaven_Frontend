"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

const DUMMY_ROOMS = [
  {
    id: "standard-room",
    title: "STANDARD ROOM",
    price: "$59",
    details: "27 m2 / 2 adults 1 child",
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000",
  },
  {
    id: "superior-room",
    title: "SUPERIOR ROOM",
    price: "$79",
    details: "32 m2 / 2 adults 2 children",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000",
  },
  {
    id: "deluxe-room",
    title: "DELUXE ROOM",
    price: "$129",
    details: "45 m2 / 3 adults 2 children",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000",
  },
  {
    id: "executive-suite",
    title: "EXECUTIVE SUITE",
    price: "$199",
    details: "65 m2 / 4 adults 2 children",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2000",
  },
  {
    id: "family-suite",
    title: "FAMILY SUITE",
    price: "$159",
    details: "55 m2 / 4 adults 3 children",
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000",
  },
  {
    id: "penthouse",
    title: "PENTHOUSE",
    price: "$399",
    details: "120 m2 / 4 adults 2 children",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000",
  }
];

export default function RoomsPage() {
  const [priceRange, setPriceRange] = useState([500]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8fafc] w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0f284f] uppercase tracking-wide">Our Rooms</h1>
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center space-x-2 bg-white px-4 py-2 border border-gray-300 rounded-sm text-[#0f284f] font-semibold uppercase text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column (Filter Sidebar) */}
          <aside className={`lg:col-span-1 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24 border border-gray-100">
              <h2 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-8">
                Filter By
              </h2>

              {/* Price Range */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Price Range
                </h3>
                <Slider
                  defaultValue={[500]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>$0</span>
                  <span>${priceRange[0]}</span>
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Room Type
                </h3>
                <div className="space-y-4">
                  {["Single", "Double", "Suite", "Deluxe"].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox id={`type-${type}`} />
                      <label 
                        htmlFor={`type-${type}`}
                        className="text-sm text-gray-600 font-medium cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Amenities
                </h3>
                <div className="space-y-4">
                  {["WiFi", "AC", "Breakfast", "Swimming Pool"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Checkbox id={`amenity-${amenity.replace(' ', '-')}`} />
                      <label 
                        htmlFor={`amenity-${amenity.replace(' ', '-')}`}
                        className="text-sm text-gray-600 font-medium cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-wider py-4 rounded-sm hover:bg-[#1a3d72] transition-colors mt-4">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Right Column (Main Content) */}
          <section className="lg:col-span-3">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="hidden lg:block text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider">
                Our Rooms
              </h1>
              <div className="flex items-center justify-between w-full lg:w-auto">
                <span className="text-sm text-gray-500 font-medium mr-4">
                  Showing {DUMMY_ROOMS.length} available rooms
                </span>
                <select className="border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0f284f] cursor-pointer">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {DUMMY_ROOMS.map((room, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white shadow-sm hover:shadow-xl rounded-lg overflow-hidden group cursor-pointer border border-gray-100 transition-all"
                >
                  <Link href={`/rooms/${room.id}`}>
                    <div className="h-60 overflow-hidden relative">
                      <Image
                        src={room.image}
                        alt={room.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-[#0f284f] font-extrabold uppercase text-lg mb-2">
                        {room.title}
                      </h3>
                      <div className="flex justify-between items-end mt-6">
                        <p className="text-gray-500 text-xs w-1/2 leading-relaxed font-medium">
                          {room.details}
                        </p>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            From
                          </p>
                          <p className="text-2xl font-black text-[#0f284f]">
                            {room.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}
