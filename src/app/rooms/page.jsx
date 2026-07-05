"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import RoomGrid from "@/components/RoomGrid";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch rooms with filters applied
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dates.checkIn) params.append("checkIn", dates.checkIn);
      if (dates.checkOut) params.append("checkOut", dates.checkOut);

      if (selectedTypes.length > 0) params.append("roomType", selectedTypes.join(","));
      if (selectedAmenities.length > 0) params.append("amenities", selectedAmenities.join(","));
      
      let sortParam = "";
      if (sortBy === "Price: Low to High") sortParam = "priceAsc";
      else if (sortBy === "Price: High to Low") sortParam = "priceDesc";
      
      if (sortParam) params.append("sort", sortParam);

      const res = await api.get(`/rooms?${params.toString()}`);
      setRooms(res.data.rooms || res.data);
    } catch (error) {
      toast.error("Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]); // Re-fetch on mount and when sorting changes

  return (
    <main className="min-h-screen bg-[#f8fafc] w-full py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto"
      >
        
        {/* Mobile Filter Toggle */}
        <motion.div variants={fadeUp} className="lg:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0f284f] uppercase tracking-wide">Our Rooms</h1>
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center space-x-2 bg-white px-4 py-2 border border-gray-300 rounded-sm text-[#0f284f] font-semibold uppercase text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column (Filter Sidebar) */}
          <motion.aside variants={fadeUp} className={`lg:col-span-1 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <SearchBar 

              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              dates={dates}
              setDates={setDates}
              onApply={() => fetchRooms()}
            />
          </motion.aside>

          {/* Right Column (Main Content) */}
          <motion.section variants={fadeUp} className="lg:col-span-3">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="hidden lg:block text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider">
                Our Rooms
              </h1>
              <div className="flex items-center justify-between w-full lg:w-auto">
                <span className="text-sm text-gray-500 font-medium mr-4">
                  {loading ? <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div> : `Showing ${rooms.length} available rooms`}
                </span>
                <select 
                  className="border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0f284f] cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Top Rated">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Room Grid */}
            <RoomGrid rooms={rooms} loading={loading} />

          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}
