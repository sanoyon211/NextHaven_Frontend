import Image from "next/image";
import { User, Calendar, LogOut, Utensils } from "lucide-react";

export default function DashboardSidebar({
  user,
  activeTab,
  setActiveTab,
  logout,
}) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-28">
      <div className="flex flex-col lg:flex-col sm:flex-row items-center text-center sm:text-left lg:text-center mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-100 gap-4 sm:gap-6 lg:gap-0">
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#0f284f] text-white text-2xl sm:text-3xl font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0f284f] uppercase tracking-wide">
            {user.name || "Guest"}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{user.email}</p>
        </div>
      </div>

      <nav className="flex flex-row overflow-x-auto lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0 scrollbar-hide">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "profile" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "bookings" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings</span>
        </button>
        <button
          onClick={() => setActiveTab("food_orders")}
          className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "food_orders" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
        >
          <Utensils className="w-4 h-4" />
          <span>Food Orders</span>
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "reservations" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Reservations</span>
        </button>
        <button
          onClick={() => logout()}
          className="flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase text-red-600 hover:bg-red-50 lg:mt-4"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
