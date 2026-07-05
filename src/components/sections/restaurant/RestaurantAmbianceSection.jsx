import { motion } from "framer-motion";
import Image from "next/image";

export default function RestaurantAmbianceSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {[
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1500",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500",
          "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1500",
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
  );
}
