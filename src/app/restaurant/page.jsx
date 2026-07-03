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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Gourmet Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"
              alt="Gourmet Dish"
              fill
              className="object-cover rounded-sm shadow-2xl"
            />
          </motion.div>

          {/* Right Side: Menu Items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Appetizers */}
            <motion.div variants={fadeUp}>
              <h3 className="text-[#0f284f] text-2xl font-bold uppercase tracking-wide border-b border-gray-200 pb-2 mb-6">
                Appetizers
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Truffle Beef Tartare</h4>
                    <p className="text-gray-500 text-sm mt-1">Quail egg, capers, toasted brioche</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$32</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Pan-Seared Scallops</h4>
                    <p className="text-gray-500 text-sm mt-1">Cauliflower purée, crispy pancetta, sage</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$28</span>
                </div>
              </div>
            </motion.div>

            {/* Main Courses */}
            <motion.div variants={fadeUp}>
              <h3 className="text-[#0f284f] text-2xl font-bold uppercase tracking-wide border-b border-gray-200 pb-2 mb-6">
                Main Courses
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Wagyu Ribeye Steak</h4>
                    <p className="text-gray-500 text-sm mt-1">Potato gratin, wild mushrooms, bordelaise sauce</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$85</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Miso Glazed Black Cod</h4>
                    <p className="text-gray-500 text-sm mt-1">Bok choy, ginger dashi broth, sesame</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$54</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Wild Mushroom Risotto</h4>
                    <p className="text-gray-500 text-sm mt-1">Arborio rice, aged parmesan, truffle oil</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$42</span>
                </div>
              </div>
            </motion.div>

            {/* Desserts */}
            <motion.div variants={fadeUp}>
              <h3 className="text-[#0f284f] text-2xl font-bold uppercase tracking-wide border-b border-gray-200 pb-2 mb-6">
                Desserts
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Valrhona Chocolate Soufflé</h4>
                    <p className="text-gray-500 text-sm mt-1">Madagascar vanilla bean ice cream</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$22</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg">Lemon Tart</h4>
                    <p className="text-gray-500 text-sm mt-1">Torched meringue, raspberry coulis</p>
                  </div>
                  <span className="text-[#0f284f] font-bold">$18</span>
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        </div>
      </section>
    </main>
  );
}
