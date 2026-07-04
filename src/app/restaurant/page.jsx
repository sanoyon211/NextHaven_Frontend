"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarCheck, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function RestaurantPage() {
  const [signatureMenu, setSignatureMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignatureMenu = async () => {
      try {
        const res = await api.get('/menu?isSignature=true');
        setSignatureMenu(res.data.menuItems || res.data);
      } catch (error) {
        console.error("Failed to fetch signature menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignatureMenu();
  }, []);

  return (
    <main className="bg-white w-full overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
          alt="Luxury Fine Dining Restaurant"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark Overlay */}
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-widest mb-8 drop-shadow-lg">
            Fine Dining At Its Best
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-md">
            Experience culinary excellence curated by our Michelin-starred chefs, 
            set in an atmosphere of unparalleled elegance and sophistication.
          </p>
          <button 
            onClick={() => window.alert('Reservation system coming soon!')}
            className="bg-white text-[#0f284f] font-extrabold uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-gray-100 transition-colors"
          >
            Reserve A Table
          </button>
        </motion.div>
      </section>

      {/* 1.5 The Dining Experience */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=1500"
              alt="People dining"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-sm shadow-xl"
            />
            <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 border-8 border-white rounded-sm shadow-xl overflow-hidden hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000"
                alt="Pouring wine"
                fill
                sizes="33vw"
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6 md:pl-10"
          >
            <h2 className="text-[#0f284f] text-4xl font-bold uppercase tracking-wider mb-4">
              A Symphony of Flavors
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Step into a realm of culinary artistry where every dish tells a story. Our Executive Chefs blend traditional techniques with modern innovation, creating a menu that is as visually stunning as it is delectable. 
            </p>
            <p className="text-gray-500 leading-relaxed text-lg">
              Sourced from the finest local purveyors and international artisans, our ingredients are the stars of the show. Pair your meal with a selection from our award-winning wine cellar, curated by our head sommelier to perfectly complement the symphony of flavors on your plate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Signature Menu Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-[#0f284f] text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
              Our Signature Menu
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A curated selection of our most exquisite dishes, prepared with the finest seasonal ingredients.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-3 flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f284f]"></div>
            </div>
          ) : signatureMenu.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden group transition-all flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col">
                <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wide mb-2 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.ingredients}</p>
                <p className="text-2xl font-black text-[#0f284f]">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/restaurant/all-menu">
            <button className="bg-[#0f284f] text-white font-extrabold uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-[#1a3d72] transition-colors">
              View Full Menu
            </button>
          </Link>
        </motion.div>
      </section>

      {/* 3. Ambiance Gallery */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {[
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1500",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500",
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500"
          ].map((src, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative h-80 md:h-[400px] w-full overflow-hidden group"
            >
              <Image
                src={src}
                alt={`Ambiance ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Hours & Reservations */}
      <section className="bg-[#f8fafc] py-24 px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* Hours */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <Clock className="w-10 h-10 text-[#ffbca8] mb-6" />
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Opening Hours</h3>
              <div className="space-y-4 text-gray-500">
                <div>
                  <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Breakfast</p>
                  <p>7:00 AM - 10:30 AM</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Lunch</p>
                  <p>12:00 PM - 3:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Dinner</p>
                  <p>6:00 PM - 11:00 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Reservations */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <CalendarCheck className="w-10 h-10 text-[#ffbca8] mb-6" />
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Reservations</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                We strongly recommend booking your table in advance, especially for dinner and weekend brunches. Walk-ins are accommodated subject to availability.
              </p>
              <button 
                onClick={() => window.alert('Reservation system coming soon!')}
                className="mt-auto border-2 border-[#0f284f] text-[#0f284f] font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#0f284f] hover:text-white transition-colors"
              >
                Book a Table
              </button>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <Phone className="w-10 h-10 text-[#ffbca8] mb-6" />
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Contact Us</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                For private dining, large groups, or special dietary requirements, please speak with our restaurant manager.
              </p>
              <div className="mt-auto space-y-2">
                <p className="text-[#0f284f] font-bold">+45 35634 3444</p>
                <p className="text-[#0f284f] font-bold">dining@thehotel.com</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
