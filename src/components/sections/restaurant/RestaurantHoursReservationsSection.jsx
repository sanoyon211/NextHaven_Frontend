import { motion } from "framer-motion";
import { Clock, CalendarCheck, Phone } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function RestaurantHoursReservationsSection({ setShowReservationDialog }) {
  return (
    <section className="bg-[#f8fafc] py-12 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12"
        >
          {/* Hours */}
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <Clock className="w-10 h-10 text-[#ffbca8] mb-6" />
            <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Opening Hours</h3>
            <div className="space-y-4 text-gray-500">
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Breakfast</p>
                <p>7:00 AM - 10:30 AM</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Lunch</p>
                <p>12:00 PM - 3:00 PM</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Dinner</p>
                <p>6:00 PM - 11:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Reservations */}
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <CalendarCheck className="w-10 h-10 text-[#ffbca8] mb-6" />
            <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Reservations</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              We strongly recommend booking your table in advance, especially for dinner and weekend brunches. Walk-ins are accommodated subject to availability.
            </p>
            <button 
              onClick={() => setShowReservationDialog(true)}
              className="mt-auto border-2 border-[#0f284f] text-[#0f284f] font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#0f284f] hover:text-white transition-colors"
            >
              Book a Table
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <Phone className="w-10 h-10 text-[#ffbca8] mb-6" />
            <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">Contact Us</h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              For private dining, large groups, or special dietary requirements, please speak with our restaurant manager.
            </p>
            <div className="mt-auto space-y-2">
              <p className="text-[#0f284f] font-bold">+45 35634 3444</p>
              <p className="text-[#0f284f] font-bold">dining@thehotel.com</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
