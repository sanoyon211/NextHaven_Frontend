import { motion } from "framer-motion";
import { Plane, Map } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutLocationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
        
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
          <h2 className="text-[#0f284f] text-3xl md:text-3xl md:text-5xl font-extrabold uppercase leading-tight mb-8">
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
                Located just steps away from the vibrant city center, you&apos;ll have 
                immediate access to the best dining, entertainment, and cultural landmarks.
              </p>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
