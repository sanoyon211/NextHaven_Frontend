import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RestaurantHeroSection({ setShowReservationDialog }) {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
        alt="Luxury Fine Dining Restaurant"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 text-center px-4"
      >
        <h1 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-widest mb-8 drop-shadow-lg">
          Fine Dining At Its Best
        </h1>
        <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-md">
          Experience culinary excellence curated by our Michelin-starred chefs, 
          set in an atmosphere of unparalleled elegance and sophistication.
        </p>
        <button 
          onClick={() => setShowReservationDialog(true)}
          className="bg-white text-[#0f284f] font-extrabold uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-gray-100 transition-colors"
        >
          Reserve A Table
        </button>
      </motion.div>
    </section>
  );
}
