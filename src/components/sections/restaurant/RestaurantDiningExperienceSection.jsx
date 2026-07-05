import { motion } from "framer-motion";
import Image from "next/image";

export default function RestaurantDiningExperienceSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=1500"
            alt="People dining"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-sm shadow-xl"
          />
          <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 border-8 border-white rounded-sm shadow-xl overflow-hidden hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000"
              alt="Pouring wine"
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6 md:pl-10"
        >
          <h2 className="text-[#0f284f] text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
            A Symphony of Flavors
          </h2>
          <p className="text-gray-500 leading-relaxed text-lg">
            Step into a realm of culinary artistry where every dish tells a
            story. Our Executive Chefs blend traditional techniques with modern
            innovation, creating a menu that is as visually stunning as it is
            delectable.
          </p>
          <p className="text-gray-500 leading-relaxed text-lg">
            Sourced from the finest local purveyors and international artisans,
            our ingredients are the stars of the show. Pair your meal with a
            selection from our award-winning wine cellar, curated by our head
            sommelier to perfectly complement the symphony of flavors on your
            plate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
