import { motion } from "framer-motion";
import { BedDouble, ClipboardList, Utensils, CalendarCheck, Users, Home } from "lucide-react";

const fadeRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AdminSidebar({ activeTab, setActiveTab, router }) {
  const tabs = [
    { id: "rooms", icon: BedDouble, label: "Rooms" },
    { id: "bookings", icon: ClipboardList, label: "Bookings" },
    { id: "food_orders", icon: Utensils, label: "Food Orders" },
    { id: "menus", icon: ClipboardList, label: "Menu Items" },
    { id: "reservations", icon: CalendarCheck, label: "Reservations" },
    { id: "users", icon: Users, label: "Users" }
  ];

  return (
    <>
      <motion.aside 
        initial="hidden" animate="visible" variants={fadeRight}
        className="w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between hidden md:flex sticky top-0 h-screen overflow-y-auto"
      >
        <div>
          <div className="px-8 py-10 border-b border-slate-100/80">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              NextHaven<span className="text-[#0f284f]">.</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Admin Workspace</p>
          </div>
          <nav className="p-4 space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${activeTab === tab.id
                    ? "bg-[#0f284f] text-white shadow-md shadow-[#0f284f]/20"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-100/80">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm"
          >
            <Home className="w-4 h-4 text-slate-400" /> Back to Website
          </button>
        </div>
      </motion.aside>

      {/* Mobile Navigation (Scrollable Tabs) */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide border-b border-slate-100 items-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
        >
          <Home className="w-4 h-4" /> Home
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1 shrink-0"></div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? "bg-[#0f284f] text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
