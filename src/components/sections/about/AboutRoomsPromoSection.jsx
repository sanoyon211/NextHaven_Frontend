import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutRoomsPromoSection() {
  return (
    <section className="bg-[#f8fafc] w-full py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <h2 className="text-[#0f284f] text-3xl md:text-3xl md:text-5xl font-extrabold uppercase leading-tight mb-8">
              CHECKOUT OUR ROOMS
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              We proudly offer a diverse selection of exquisitely furnished
              rooms and suites, designed to cater to your every need. Whether
              you are traveling for business or leisure, our accommodations
              provide the perfect blend of comfort, style, and state-of-the-art
              amenities.
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
            className="relative h-[500px] sm:h-[600px] w-full order-1 lg:order-2"
          >
            {/* Main Tall Image */}
            <Image
              src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"
              alt="Premium Bedroom"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-sm shadow-xl"
            />
            {/* Overlapping Smaller Image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-10 -left-10 w-2/3 h-2/3 border-8 border-[#f8fafc] rounded-sm shadow-xl overflow-hidden hidden md:block z-10"
            >
              <Image
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
                alt="Deluxe Room"
                fill
                sizes="33vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
