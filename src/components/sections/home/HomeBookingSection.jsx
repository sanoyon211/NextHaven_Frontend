"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function HomeBookingSection() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [capacity, setCapacity] = useState("1");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        const roomsData = res.data.rooms || res.data;
        setRooms(roomsData.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (capacity) params.append("capacity", capacity);
    
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <motion.section 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-[#f8fafc] py-12 md:py-20 px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h2 className="text-[#0f284f] text-2xl md:text-3xl md:text-4xl font-bold uppercase tracking-wider">
            Book Your Stay
          </h2>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-lg shadow-lg p-6 mb-20 max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Check-in</label>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f]" 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Check-out</label>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f]" 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Capacity</label>
              <select 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f] bg-white"
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5+ People</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Rooms</label>
              <select className="border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0f284f] bg-white">
                <option>1 Room</option>
                <option>2 Rooms</option>
                <option>3 Rooms</option>
              </select>
            </div>
            <button type="submit" className="bg-[#0f284f] text-white font-bold uppercase tracking-wider p-3 rounded hover:bg-[#1a3d72] transition-colors h-[46px]">
              Search
            </button>
          </form>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 animate-pulse flex flex-col h-[400px]">
                  <div className="h-48 md:h-60 bg-slate-200/60 w-full"></div>
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <div className="h-6 md:h-8 bg-slate-200 rounded-md w-3/4 mb-4 md:mb-6"></div>
                    <div className="flex justify-between items-end mt-auto gap-2">
                      <div className="w-[60%]">
                        <div className="h-3 bg-slate-200 rounded w-full mb-1.5"></div>
                        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                      </div>
                      <div className="text-right w-[40%] flex flex-col items-end">
                        <div className="h-3 bg-slate-200 rounded w-10 mb-2"></div>
                        <div className="h-7 md:h-9 bg-slate-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : rooms.length === 0 ? (
            <div className="col-span-full flex flex-col justify-center items-center py-12 md:py-20 bg-white rounded-lg border border-gray-100 shadow-sm w-full">
              <h3 className="text-[#0f284f] text-2xl font-bold uppercase tracking-wide mb-2">No Rooms Available</h3>
              <p className="text-gray-500">There are currently no rooms available to display.</p>
            </div>
          ) : rooms.map((room) => (
            <Link key={room._id} href={`/rooms/${room._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white shadow-sm hover:shadow-xl rounded-lg overflow-hidden group cursor-pointer border border-gray-100 transition-all flex flex-col h-full"
              >
                <div className="h-48 md:h-60 overflow-hidden relative bg-gray-100">
                  <Image
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"}
                    alt={room.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-[#0f284f] font-extrabold uppercase text-base md:text-lg mb-4 md:mb-6 leading-snug">
                    {room.roomNumber ? `ROOM ${room.roomNumber} - ${room.title}` : room.title}
                  </h3>
                  <div className="flex justify-between items-end mt-auto flex-1 gap-2">
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed w-[60%]">
                      {room.description || "Experience comfort and luxury in our beautifully appointed rooms, designed to provide you with the perfect retreat during your stay."}
                    </p>
                    <div className="text-right w-[40%]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">FROM</p>
                      <p className="text-xl md:text-3xl font-black text-[#0f284f]">${room.price || room.pricePerNight}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
