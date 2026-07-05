import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactHeroSection() {
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000"
        alt="Luxury Hotel Reception"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        <h1 className="text-white text-5xl md:text-6xl font-bold uppercase tracking-widest drop-shadow-md">
          Get In Touch
        </h1>
      </motion.div>
    </section>
  );
}
