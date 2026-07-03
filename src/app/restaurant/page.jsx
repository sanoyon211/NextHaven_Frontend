"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <main className="bg-white w-full overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
          alt="Luxury Fine Dining Restaurant"
          fill
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
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden group transition-all"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"
                alt="Wagyu Ribeye Steak"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wide mb-2">
                Wagyu Ribeye Steak
              </h3>
              <p className="text-gray-500 text-sm mb-4">Potato gratin, wild mushrooms, bordelaise sauce</p>
              <p className="text-2xl font-black text-[#0f284f]">$85</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden group transition-all"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1500"
                alt="Pan-Seared Scallops"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wide mb-2">
                Pan-Seared Scallops
              </h3>
              <p className="text-gray-500 text-sm mb-4">Cauliflower purée, crispy pancetta, sage</p>
              <p className="text-2xl font-black text-[#0f284f]">$28</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden group transition-all"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1563805042-7684c8e9e1cb?q=80&w=1500"
                alt="Valrhona Chocolate Soufflé"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wide mb-2">
                Chocolate Soufflé
              </h3>
              <p className="text-gray-500 text-sm mb-4">Madagascar vanilla bean ice cream</p>
              <p className="text-2xl font-black text-[#0f284f]">$22</p>
            </div>
          </motion.div>
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
    </main>
  );
}
