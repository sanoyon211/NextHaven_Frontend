"use client";

import { User, Calendar, CreditCard, Settings, LogOut } from "lucide-react";

const MOCK_BOOKINGS = [
  { id: "BKG-9921", room: "Deluxe Room", checkIn: "2023-10-15", checkOut: "2023-10-20", amount: "$645", status: "Paid" },
  { id: "BKG-7743", room: "Superior Room", checkIn: "2023-08-01", checkOut: "2023-08-05", amount: "$316", status: "Completed" },
  { id: "BKG-4412", room: "Executive Suite", checkIn: "2023-12-24", checkOut: "2023-12-28", amount: "$796", status: "Upcoming" },
];

export default function GuestDashboard() {
  return (
    <main className="min-h-screen bg-[#f8fafc] w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-[#0f284f] text-white flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">John Doe</h3>
                  <p className="text-xs text-gray-300">Guest</p>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-gray-50 text-[#0f284f] font-semibold rounded-sm">
                  <Calendar className="w-5 h-5" />
                  <span>My Bookings</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0f284f] font-medium transition-colors rounded-sm">
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0f284f] font-medium transition-colors rounded-sm">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0f284f] font-medium transition-colors rounded-sm">
                  <Settings className="w-5 h-5" />
                  <span>Preferences</span>
                </a>
                <hr className="my-2" />
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 font-medium transition-colors rounded-sm">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider mb-6">
                Personal Booking History
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
                      <th className="p-4 font-bold rounded-tl-sm">Booking ID</th>
                      <th className="p-4 font-bold">Room Name</th>
                      <th className="p-4 font-bold">Check-in</th>
                      <th className="p-4 font-bold">Check-out</th>
                      <th className="p-4 font-bold">Total Amount</th>
                      <th className="p-4 font-bold rounded-tr-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BOOKINGS.map((booking, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-semibold text-[#0f284f]">{booking.id}</td>
                        <td className="p-4 text-sm text-gray-700">{booking.room}</td>
                        <td className="p-4 text-sm text-gray-500">{booking.checkIn}</td>
                        <td className="p-4 text-sm text-gray-500">{booking.checkOut}</td>
                        <td className="p-4 text-sm font-bold text-gray-900">{booking.amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "Paid" ? "bg-green-100 text-green-800" :
                            booking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
