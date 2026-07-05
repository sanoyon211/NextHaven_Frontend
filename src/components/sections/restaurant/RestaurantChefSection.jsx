import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";

export default function RestaurantChefSection() {
  return (
    <section className="w-full bg-[#0f284f] text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1500"
            alt="Master Chef"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl rounded-sm"
          />
          <div className="absolute -bottom-6 -right-6 bg-[#d4af37] text-[#0f284f] p-6 shadow-xl hidden md:block">
            <p className="font-heading text-4xl font-bold">25+</p>
            <p className="font-sans text-sm font-bold uppercase tracking-wider">
              Years of Excellence
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center lg:pl-12"
        >
          <h2 className="font-heading text-[#d4af37] text-3xl md:text-5xl font-bold mb-6">
            Meet the Maestro
          </h2>
          <div className="w-16 h-1 bg-white mb-8"></div>
          <Quote className="w-10 h-10 text-white/20 mb-4" />
          <p className="text-gray-200 text-xl font-sans italic leading-relaxed mb-8">
            &quot;Cooking is not just about combining ingredients; it is an art
            of storytelling. Every dish we serve at NextHaven is a chapter of
            passion, crafted to evoke memories and create new ones.&quot;
          </p>
          <h3 className="font-heading text-2xl font-bold mb-1">
            Alessandro Rossi
          </h3>
          <p className="font-sans text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-8">
            Executive Chef
          </p>
          <Link href="#signature-menu">
            <button className="self-start border border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#d4af37] hover:text-[#0f284f] transition-colors duration-300">
              Taste His Creations
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
