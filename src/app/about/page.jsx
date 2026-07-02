"use client";

import { motion } from "framer-motion";
import { Plane, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Animation variant for scroll reveals
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutPage() {
  return (
    <main className="w-full bg-white overflow-hidden">
      
      {/* SECTION 1: Intro */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Image Collage */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative h-[500px] sm:h-[600px] w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Main Tall Image */}
            <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-sm overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
                alt="Dining Area"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
              />
            </div>
            {/* Overlapping Smaller Image */}
            <div className="absolute bottom-0 right-0 w-3/5 h-2/5 rounded-sm overflow-hidden shadow-2xl border-4 border-white z-10">
              <Image
                src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000"
                alt="Lounge Area"
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-[#0f284f] text-4xl sm:text-5xl lg:text-5xl font-extrabold uppercase leading-[1.15] mb-8 tracking-tight">
              WHERE EVERY STAY IS A HUG OF HOSPITALITY
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              At Hoteller, we pride ourselves on delivering an unforgettable experience. 
              Our commitment to excellence ensures that every guest feels the warmth of 
              our hospitality from the moment they step through our doors.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We combine modern luxury with timeless elegance, creating a sanctuary 
              where you can escape the hustle of the city while remaining at its very heart.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Rooms Promo */}
      <section className="bg-[#f8fafc] w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="flex flex-col justify-center order-2 lg:order-1"
            >
              <h2 className="text-[#0f284f] text-4xl sm:text-5xl font-extrabold uppercase leading-tight mb-8">
                CHECKOUT OUR ROOMS
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                We proudly offer a diverse selection of exquisitely furnished rooms and suites, 
                designed to cater to your every need. Whether you are traveling for business 
                or leisure, our accommodations provide the perfect blend of comfort, style, 
                and state-of-the-art amenities.
              </p>
              <div>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center bg-[#0f284f] text-white font-bold uppercase tracking-wider px-10 py-5 rounded-sm hover:bg-[#1a3d72] transition-colors"
                >
                  BOOK YOUR STAY NOW
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] sm:h-[600px] w-full max-w-md mx-auto lg:mx-0 order-1 lg:order-2"
            >
              {/* Main Tall Image */}
              <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"
                  alt="Premium Bedroom"
                  fill
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-cover"
                />
              </div>
              {/* Overlapping Smaller Image */}
              <div className="absolute bottom-0 left-0 w-3/5 h-2/5 rounded-sm overflow-hidden shadow-2xl border-4 border-[#f8fafc] z-10">
                <Image
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
                  alt="Deluxe Room"
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Location & Directions */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full h-[400px] lg:h-full min-h-[400px] rounded-sm overflow-hidden shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2701.378779694732!2d8.53796541562283!3d47.37530277916947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900a06282ec691%3A0xc608b49e6d787037!2sZurich%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1689694205728!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </motion.div>

          {/* Right Column: Text & Mini Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[#0f284f] text-4xl sm:text-5xl font-extrabold uppercase leading-tight mb-8">
              HOW TO FIND OUR HOTEL
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              Let us be your hosts in the heart of the city. We are centrally located, 
              making it effortless to explore major attractions, business centers, 
              and premium shopping districts during your stay.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              
              {/* Mini Column 1: Airport */}
              <div>
                <Plane className="w-10 h-10 text-[#ffbca8] mb-4" />
                <h3 className="text-[#ffbca8] text-sm font-bold uppercase tracking-widest mb-3">
                  31 KILOMETRES FROM AIRPORT
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  A short, scenic drive from the international airport. Our concierge 
                  can arrange private transfers to ensure a seamless arrival experience.
                </p>
              </div>

              {/* Mini Column 2: City Center */}
              <div>
                <Map className="w-10 h-10 text-[#ffbca8] mb-4" />
                <h3 className="text-[#ffbca8] text-sm font-bold uppercase tracking-widest mb-3">
                  1.3 KILOMETRES FROM City Center
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Located just steps away from the vibrant city center, you'll have 
                  immediate access to the best dining, entertainment, and cultural landmarks.
                </p>
              </div>
              
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
