"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import RoomGrid from "@/components/RoomGrid";

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [priceRange, setPriceRange] = useState([1000]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch rooms initially (and on date change if needed)
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dates.checkIn) params.append("checkIn", dates.checkIn);
      if (dates.checkOut) params.append("checkOut", dates.checkOut);

      const res = await api.get(`/rooms?${params.toString()}`);
      setAllRooms(res.data.rooms || res.data);
    } catch (error) {
      toast.error("Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Client-side filtering and sorting
  useEffect(() => {
    let result = [...allRooms];

    // Filter by Max Price
    if (priceRange[0] !== undefined) {
      result = result.filter(room => room.pricePerNight <= priceRange[0]);
    }

    // Filter by Room Type
    if (selectedTypes.length > 0) {
      result = result.filter(room => 
        selectedTypes.some(type => room.roomType.toLowerCase() === type.toLowerCase())
      );
    }

    // Filter by Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(room => 
        selectedAmenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    // Sort
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "Most Popular") {
      // Dummy sort for now if no popularity metric
    } else if (sortBy === "Top Rated") {
      // Dummy sort for now if no rating metric
    }

    setFilteredRooms(result);
  }, [allRooms, priceRange, selectedTypes, selectedAmenities, sortBy]);

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
            <SearchBar 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              dates={dates}
              setDates={setDates}
              onApply={() => {}} // No longer needs to fetch on apply since it's client-side reactive
            />
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
                  {loading ? "Loading..." : `Showing ${filteredRooms.length} available rooms`}
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
            <RoomGrid rooms={filteredRooms} loading={loading} />

          </section>
        </div>
      </div>
    </main>
  );
}
