import { motion } from "framer-motion";
import { DollarSign, CalendarCheck, BedDouble, Home } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AdminOverview({ analytics, loadingAnalytics }) {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Bookings",
      value: analytics.activeBookings,
      icon: CalendarCheck,
      color: "text-[#0f284f]",
      bg: "bg-[#0f284f]/10",
    },
    {
      title: "Rooms Available",
      value: analytics.availableRooms,
      icon: BedDouble,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Rooms",
      value: analytics.totalRooms,
      icon: Home,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
    >
      {stats.map((stat, index) => (
        <motion.div
          variants={fadeUp}
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-3 md:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <p className="text-xs md:text-sm font-semibold text-slate-500">
              {stat.title}
            </p>
            <div
              className={`p-2.5 ${stat.bg} rounded-xl ${stat.color} transition-transform group-hover:scale-110`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {loadingAnalytics ? "..." : stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
