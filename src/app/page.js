"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Star, Coffee, Wifi, Wine, Sparkles, Quote } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Home() {
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
        // Get up to 4 rooms for the featured section
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
    <main className="overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-center items-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
          alt="Luxury Hotel Bedroom"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Elegant dark overlay */}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-6 text-[#d4af37]">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <h1 className="font-heading text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            A Room To Remember
          </h1>
          <p className="text-gray-100 text-lg md:text-xl font-sans leading-relaxed mb-10 max-w-2xl drop-shadow-md">
            Discover a world of comfort, luxury, and unparalleled hospitality at
            NextHaven. Your exquisite home away from home.
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center bg-[#d4af37] text-[#0f284f] font-bold uppercase tracking-widest px-10 py-5 rounded-none hover:bg-white transition-colors duration-300 shadow-xl"
          >
            Book Your Stay
          </Link>
        </motion.div>
      </section>

      {/* Experience the Luxury (Amenities) */}
      <section className="py-20 md:py-32 bg-white w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="font-heading text-[#0f284f] text-3xl md:text-5xl font-bold mb-6">Experience the Luxury</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-6"></div>
            <p className="text-gray-500 font-sans text-lg max-w-2xl mx-auto">
              Indulge in our world-class amenities designed to elevate your stay to an unforgettable experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {[
              { icon: Sparkles, title: "Luxury Spa", desc: "Rejuvenate your senses with our premium spa treatments." },
              { icon: Wine, title: "Fine Dining", desc: "Experience culinary masterpieces from Michelin-starred chefs." },
              { icon: Wifi, title: "High-Speed Wifi", desc: "Stay connected with complimentary high-speed internet." },
              { icon: Coffee, title: "24/7 Concierge", desc: "Our dedicated staff is at your service around the clock." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp} 
                className="group flex flex-col items-center p-8 bg-[#f8fafc] border border-gray-100 hover:border-[#d4af37] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 text-[#0f284f]">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0f284f] mb-3">{item.title}</h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-20 bg-[#0f284f] w-full overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0f284f] to-transparent z-10 hidden md:block"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0f284f] to-transparent z-10 hidden md:block"></div>
        
        <div className="text-center mb-16 relative z-20">
          <h2 className="font-heading text-white text-3xl md:text-5xl font-bold mb-4">Guest Experiences</h2>
          <p className="text-gray-300 font-sans">What our esteemed guests say about NextHaven.</p>
        </div>

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 1, 2, 3, 4].map((num, idx) => (
            <div key={idx} className="w-[85vw] sm:w-[400px] md:w-[450px] px-4 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 flex flex-col h-full rounded-sm">
                <Quote className="w-8 h-8 text-[#d4af37] mb-4 opacity-50" />
                <p className="font-sans text-gray-200 italic mb-6 flex-1">
                  "Absolutely breathtaking! The attention to detail, the luxurious rooms, and the impeccable service made our anniversary unforgettable."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
                    <Image src={`https://i.pravatar.cc/150?img=${num * 10}`} width={40} height={40} alt="Guest" />
                  </div>
                  <div>
                    <h4 className="font-heading text-white font-bold text-sm">Eleanor Williams</h4>
                    <p className="font-sans text-[#d4af37] text-xs">New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Bar and Room Grid */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="bg-[#f8fafc] py-12 md:py-20 px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="mx-auto max-w-7xl">
          {/* Booking Bar Title */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-[#0f284f] text-2xl md:text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Book Your Stay
            </h2>
          </motion.div>

          {/* Booking Bar Form */}
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

          {/* Room Grid */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-4 flex justify-center items-center py-12 md:py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f284f]"></div>
              </div>
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
    </main>
  );
}
