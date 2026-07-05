import { motion } from "framer-motion";
import { Sparkles, Wine, Wifi, Coffee } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function HomeAmenitiesSection() {
  return (
    <section className="py-20 md:py-32 bg-white w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-heading text-[#0f284f] text-3xl md:text-5xl font-bold mb-6">
            Experience the Luxury
          </h2>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-6"></div>
          <p className="text-gray-500 font-sans text-lg max-w-2xl mx-auto">
            Indulge in our world-class amenities designed to elevate your stay
            to an unforgettable experience.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {[
            {
              icon: Sparkles,
              title: "Luxury Spa",
              desc: "Rejuvenate your senses with our premium spa treatments.",
            },
            {
              icon: Wine,
              title: "Fine Dining",
              desc: "Experience culinary masterpieces from Michelin-starred chefs.",
            },
            {
              icon: Wifi,
              title: "High-Speed Wifi",
              desc: "Stay connected with complimentary high-speed internet.",
            },
            {
              icon: Coffee,
              title: "24/7 Concierge",
              desc: "Our dedicated staff is at your service around the clock.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="group flex flex-col items-center p-8 bg-[#f8fafc] border border-gray-100 hover:border-[#d4af37] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 text-[#0f284f]">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#0f284f] mb-3">
                {item.title}
              </h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
