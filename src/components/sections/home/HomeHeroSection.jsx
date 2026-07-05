import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function HomeHeroSection() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-center items-center text-center">
      <Image
        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
        alt="Luxury Hotel Bedroom"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      
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
  );
}
