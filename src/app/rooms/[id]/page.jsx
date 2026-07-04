"use client";

import { motion } from "framer-motion";
import { BellRing, Wine, Dumbbell, Umbrella, Check, Star } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";

// Helper animation variant for scroll reveals
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RoomPage({ params }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id;
  
  const router = useRouter();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

  // Booking Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const [roomRes, datesRes] = await Promise.all([
          api.get(`/rooms/${rawId}`),
          api.get(`/bookings/room/${rawId}/dates`).catch(() => ({ data: { data: [] } }))
        ]);
        setRoom(roomRes.data.room || roomRes.data);
        setBookedDates(datesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };
    if (rawId) {
      fetchRoomData();
    }
  }, [rawId]);

  if (loading) {
    return (
      <main className="bg-white w-full min-h-screen">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-pulse">
            <div className="flex flex-col justify-center">
              <div className="h-14 bg-gray-200 rounded-sm w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-sm w-1/4 mb-8"></div>
              
              <div className="space-y-4 mb-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-80"></div>
            </div>

            <div className="h-[60vh] lg:h-[80vh] w-full bg-gray-200 rounded-sm"></div>
          </div>
        </section>
      </main>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white flex-col">
        <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-4">Room Not Found</h1>
        <button onClick={() => router.push("/rooms")} className="bg-[#0f284f] text-white px-6 py-2 rounded">
          Back to Rooms
        </button>
      </div>
    );
  }

  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;
    const selectedDateObj = new Date(selectedDate);
    
    // Check if selected check-in date falls inside any existing booking
    const isBooked = bookedDates.some(booking => {
      const inDate = new Date(booking.checkInDate);
      const outDate = new Date(booking.checkOutDate);
      // It's occupied if it's >= checkIn and < checkOut
      return selectedDateObj >= inDate && selectedDateObj < outDate;
    });

    if (isBooked) {
      toast.error("This date is already booked. Please select an available date.");
      setCheckIn("");
      setCheckOut("");
      return;
    }

    setCheckIn(selectedDate);
    
    // Reset checkout if it's before or equal to checkin
    if (checkOut && new Date(checkOut) <= selectedDateObj) {
      setCheckOut("");
    }
  };

  const getMaxCheckOutDate = () => {
    if (!checkIn) return undefined;
    const checkInDateObj = new Date(checkIn);
    
    // Find the next booking that starts AFTER the selected check-in
    const upcomingBookings = bookedDates
      .map(b => new Date(b.checkInDate))
      .filter(date => date > checkInDateObj)
      .sort((a, b) => a - b);
      
    if (upcomingBookings.length > 0) {
      // The max check-out date is the checkIn date of the next booking
      return upcomingBookings[0].toISOString().split('T')[0];
    }
    return undefined; // No future bookings, they can book as long as they want
  };

  const todayStr = new Date().toISOString().split('T')[0];
  let minCheckOutStr = todayStr;
  if (checkIn) {
    const minCheckOutDate = new Date(checkIn);
    minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);
    minCheckOutStr = minCheckOutDate.toISOString().split('T')[0];
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a room");
      router.push("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setIsBooking(true);
    const toastId = toast.loading("Redirecting to secure payment...");

    try {
      const response = await api.post("/bookings/checkout", {
        roomId: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfAdults: adults,
        numberOfChildren: children,
        specialRequests,
      });

      if (response.data?.clientSecret) {
        router.push(`/payment?clientSecret=${response.data.clientSecret}&amount=${response.data.amount}`);
      } else {
        throw new Error("No client secret returned");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to initiate booking. Please try again.";
      toast.error(errorMsg, { id: toastId });
      setIsBooking(false);
    }
  };

  let totalNights = 0;
  let totalCost = 0;
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (!isNaN(inDate) && !isNaN(outDate) && outDate > inDate) {
      totalNights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      totalCost = totalNights * room.pricePerNight;
    }
  }

  return (
    <main className="bg-white w-full overflow-hidden">
      {/* 1. Hero / Top Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex flex-col justify-center"
          >
            <h1 className="text-[#0f284f] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight mb-6">
              {room.roomNumber ? `Room ${room.roomNumber} - ${room.title}` : room.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {room.description}
            </p>
            <p className="text-[#0f284f] text-2xl font-black mb-8">
              ${room.pricePerNight} <span className="text-sm text-gray-500 font-medium uppercase tracking-widest">/ Night</span>
            </p>
            
            <ul className="space-y-4 mb-10">
              {(room.amenities && room.amenities.length > 0 ? room.amenities.slice(0, 4) : ["Master Bedroom with King-Size Bed", "Fully Equipped Kitchenette", "Modern En-suite Bathroom", "Spacious Private Balcony"]).map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700 font-medium">
                  <Check className="h-5 w-5 text-[#0f284f] mr-3" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
              <h3 className="text-[#0f284f] font-bold uppercase tracking-wider mb-4">Book Your Stay</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in Date</label>
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={handleCheckInChange}
                    min={todayStr}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0f284f]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out Date</label>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)} 
                    min={minCheckOutStr}
                    max={getMaxCheckOutDate()}
                    disabled={!checkIn}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0f284f] disabled:bg-gray-100 disabled:cursor-not-allowed" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adults</label>
                  <input type="number" min="1" value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0f284f]" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Children</label>
                  <input type="number" min="0" value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0f284f]" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Special Requests (Optional)</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows="2" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0f284f] resize-none" placeholder="e.g. Late check-in, extra pillows..." />
              </div>
              
              {totalNights > 0 && (
                <div className="mb-6 p-4 bg-white border border-gray-200 rounded-sm flex justify-between items-center shadow-sm">
                  <span className="text-gray-600 font-semibold uppercase tracking-wider text-sm">
                    {totalNights} {totalNights > 1 ? "Nights" : "Night"}
                  </span>
                  <span className="text-2xl font-black text-[#0f284f]">${totalCost.toFixed(2)}</span>
                </div>
              )}

              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-[#1a3d72] transition-colors disabled:opacity-70"
              >
                {isBooking ? "PROCESSING..." : "PROCEED TO PAYMENT"}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[60vh] lg:h-[80vh] w-full relative"
          >
            <Image
              src={room.images?.[0] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000"}
              alt={room.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-sm shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Gallery Section */}
      <section className="w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <div className="h-80 md:h-[400px] relative">
            <Image
              src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1500"
              alt="Room view 1"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="h-80 md:h-[400px] relative">
            <Image
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1500"
              alt="Room view 2"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="h-80 md:h-[400px] relative">
            <Image
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1500"
              alt="Room view 3"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* 3. Amenities & Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-square w-full relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000"
              alt="Floor plan placeholder"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-sm shadow-lg grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-[#0f284f] text-3xl font-bold uppercase mb-10 tracking-wide">
              Included Amenities and Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-4">Amenities</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>40-inch LED TV</li>
                  <li>Mini Bar & Refrigerator</li>
                  <li>Safe Deposit Box</li>
                  <li>Nespresso Coffee Machine</li>
                  <li>Luxury Bathrobes</li>
                  <li>Premium Toiletries</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 uppercase mb-4">Services</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>24-hour Room Service</li>
                  <li>Free High-Speed Wi-Fi</li>
                  <li>Daily Housekeeping</li>
                  <li>Evening Turndown</li>
                  <li>Wake-up Service</li>
                  <li>Access to Executive Lounge</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Hotel Facilities Section */}
      <section className="bg-[#0f284f] text-white py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-7xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Hotel Services and Facilities Included
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-6">
                <BellRing className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3">Reception Service</h3>
              <p className="text-gray-300 text-sm leading-relaxed">24/7 dedicated concierge at your service for any arrangements.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-6">
                <Wine className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3">Bar & Lounge</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Exclusive access to our premium selection of spirits and wines.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-6">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3">Fitness Facilities</h3>
              <p className="text-gray-300 text-sm leading-relaxed">State-of-the-art gym equipment available around the clock.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-5 rounded-full mb-6">
                <Umbrella className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3">Roof Terrace</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Relax by the rooftop pool with panoramic city and ocean views.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Practical Information (FAQ) Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full h-[500px] lg:h-full lg:min-h-[600px] sticky top-24"
          >
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
                alt="Dining Lounge"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-sm shadow-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-[#0f284f] text-3xl font-bold uppercase mb-10 tracking-wide">
              Practical Information
            </h2>
            
            <Accordion type="single" className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-gray-100 rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-all">
                <AccordionTrigger className="text-left font-bold text-[#0f284f] uppercase tracking-wide hover:no-underline hover:text-[#ffbca8] transition-colors">
                  How do I make a reservation?
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed text-base pt-2 pb-4">
                  You can securely book your stay through our website by clicking the &quot;Book Now&quot; button, or by contacting our reservations team directly via phone or email. We require a valid credit card to guarantee your room.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-white border border-gray-100 rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-all">
                <AccordionTrigger className="text-left font-bold text-[#0f284f] uppercase tracking-wide hover:no-underline hover:text-[#ffbca8] transition-colors">
                  What is the check-in/check-out policy?
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed text-base pt-2 pb-4">
                  Standard check-in time is from 3:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out can be arranged subject to availability and may incur an additional fee.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-white border border-gray-100 rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-all">
                <AccordionTrigger className="text-left font-bold text-[#0f284f] uppercase tracking-wide hover:no-underline hover:text-[#ffbca8] transition-colors">
                  Do you offer airport shuttle service?
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed text-base pt-2 pb-4">
                  Yes, we provide complimentary luxury airport transfers for guests staying in Executive Suites and above. For other room types, transfers can be arranged for an additional charge.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-white border border-gray-100 rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-all">
                <AccordionTrigger className="text-left font-bold text-[#0f284f] uppercase tracking-wide hover:no-underline hover:text-[#ffbca8] transition-colors">
                  Is breakfast included in the room rate?
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed text-base pt-2 pb-4">
                  Our standard rates are room-only, but you can easily add our award-winning buffet breakfast during the booking process or upon arrival at the hotel.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-white border border-gray-100 rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-all">
                <AccordionTrigger className="text-left font-bold text-[#0f284f] uppercase tracking-wide hover:no-underline hover:text-[#ffbca8] transition-colors">
                  Are pets allowed in the hotel?
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed text-base pt-2 pb-4">
                  We welcome small pets up to 15lbs in our designated pet-friendly rooms for a non-refundable cleaning fee. Please notify us in advance if you plan to bring your furry friend.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* 6. Guest Reviews & Ratings Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="text-center mb-16">
            <h2 className="text-[#0f284f] text-3xl font-bold uppercase tracking-wider mb-4">
              Guest Reviews & Ratings
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Discover what our guests have to say about their unforgettable stays.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                &quot;An absolutely breathtaking experience. The room was pristine, the views were unmatched, and the service was impeccable from start to finish.&quot;
              </p>
              <div className="flex items-center">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" 
                  alt="Sarah Jenkins" 
                  width={48}
                  height={48}
                  className="rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-[#0f284f] font-bold">Sarah Jenkins</h4>
                  <span className="text-sm text-gray-500">Stayed in June</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                &quot;NextHaven exceeded all my expectations. The amenities were top-tier, and the staff went out of their way to ensure our anniversary was perfect.&quot;
              </p>
              <div className="flex items-center">
                <Image 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces" 
                  alt="Michael Chen" 
                  width={48}
                  height={48}
                  className="rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-[#0f284f] font-bold">Michael Chen</h4>
                  <span className="text-sm text-gray-500">Stayed in August</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                &quot;The attention to detail in the room design is stunning. I felt completely relaxed. Highly recommend booking the suite with the ocean view!&quot;
              </p>
              <div className="flex items-center">
                <Image 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces" 
                  alt="Emma Roberts" 
                  width={48}
                  height={48}
                  className="rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-[#0f284f] font-bold">Emma Roberts</h4>
                  <span className="text-sm text-gray-500">Stayed in September</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
