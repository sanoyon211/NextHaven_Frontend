import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutIntroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
        {/* Left Column: Image Collage */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="relative h-[500px] sm:h-[600px] w-full"
        >
          {/* Main Tall Image */}
          <Image
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000"
            alt="Dining Area"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-sm shadow-xl"
            priority
          />
          {/* Overlapping Smaller Image */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-10 -right-10 w-2/3 h-2/3 border-8 border-white rounded-sm shadow-xl overflow-hidden hidden md:block z-10"
          >
            <Image
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000"
              alt="Lounge Area"
              fill
              sizes="33vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Right Column: Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-[#0f284f] text-3xl md:text-3xl md:text-5xl font-extrabold uppercase leading-[1.15] mb-8 tracking-tight">
            WHERE EVERY STAY IS A HUG OF HOSPITALITY
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            At Hoteller, we pride ourselves on delivering an unforgettable
            experience. Our commitment to excellence ensures that every guest
            feels the warmth of our hospitality from the moment they step
            through our doors.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We combine modern luxury with timeless elegance, creating a
            sanctuary where you can escape the hustle of the city while
            remaining at its very heart.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
