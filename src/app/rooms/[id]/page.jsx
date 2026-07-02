"use client";

import { motion } from "framer-motion";
import { BellRing, Wine, Dumbbell, Umbrella, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { use } from "react";

// Helper animation variant for scroll reveals
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RoomPage({ params }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "deluxe-room";
  const title = decodeURIComponent(rawId).replace(/-/g, " ").toUpperCase();

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
              {title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Experience the pinnacle of luxury in our meticulously designed space.
              This room offers breathtaking views, premium furnishings, and a serene
              atmosphere perfect for relaxation after a long day of exploring or business.
            </p>
            
            <ul className="space-y-4 mb-10">
              {["Master Bedroom with King-Size Bed", "Fully Equipped Kitchenette", "Modern En-suite Bathroom", "Spacious Private Balcony"].map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700 font-medium">
                  <Check className="h-5 w-5 text-[#0f284f] mr-3" />
                  {feature}
                </li>
              ))}
            </ul>

            <div>
              <button className="bg-[#0f284f] text-white font-bold uppercase tracking-wider px-8 py-4 rounded hover:bg-[#1a3d72] transition-colors">
                BOOK YOUR STAY NOW
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[60vh] lg:h-[80vh] w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000"
              alt="Premium Bedroom"
              className="w-full h-full object-cover rounded-sm shadow-xl"
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
          <div className="h-80 md:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1500"
              alt="Room view 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-80 md:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1500"
              alt="Room view 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-80 md:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1500"
              alt="Room view 3"
              className="w-full h-full object-cover"
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
            className="aspect-square w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000"
              alt="Floor plan placeholder"
              className="w-full h-full object-cover rounded-sm shadow-lg grayscale hover:grayscale-0 transition-all duration-500"
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
            <img
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
              alt="Dining Lounge"
              className="w-full h-full object-cover rounded-sm shadow-xl"
            />
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
            
            <Accordion type="single" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-bold text-gray-900 uppercase">
                  How do I make a reservation?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  You can securely book your stay through our website by clicking the "Book Now" button, or by contacting our reservations team directly via phone or email. We require a valid credit card to guarantee your room.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-bold text-gray-900 uppercase">
                  What is the check-in/check-out policy?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Standard check-in time is from 3:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out can be arranged subject to availability and may incur an additional fee.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-bold text-gray-900 uppercase">
                  Do you offer airport shuttle service?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Yes, we provide complimentary luxury airport transfers for guests staying in Executive Suites and above. For other room types, transfers can be arranged for an additional charge.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-bold text-gray-900 uppercase">
                  Is breakfast included in the room rate?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Our standard rates are room-only, but you can easily add our award-winning buffet breakfast during the booking process or upon arrival at the hotel.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-bold text-gray-900 uppercase">
                  Are pets allowed in the hotel?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  We welcome small dogs (up to 15kg) in selected room categories. A pet fee applies, and we request that you notify us at the time of booking so we can prepare specialized pet amenities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
