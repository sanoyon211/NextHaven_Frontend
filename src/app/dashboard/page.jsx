"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Calendar, LogOut, FileText, XCircle, Crown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bookings");
  const [localBookings, setLocalBookings] = useState([
    {
      _id: "BK-8472",
      id: "BK-8472",
      roomName: "Deluxe Room",
      checkIn: "Oct 12, 2026",
      checkOut: "Oct 15, 2026",
      total: "$387",
      status: "Paid",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
    },
    {
      _id: "BK-9912",
      id: "BK-9912",
      roomName: "Executive Suite",
      checkIn: "Nov 01, 2026",
      checkOut: "Nov 05, 2026",
      total: "$1,250",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800"
    }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f284f]"></div>
      </div>
    );
  }

  if (!user) return null;

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 40, 79); // #0f284f
    doc.text("HOTEL SUITES", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Invoice / Receipt", 14, 30);
    
    // Booking Details
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Booking ID: ${booking.id}`, 14, 45);
    doc.text(`Guest Name: ${user?.name || 'Guest'}`, 14, 52);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 59);

    // Table
    doc.autoTable({
      startY: 70,
      head: [['Description', 'Check-in', 'Check-out', 'Total']],
      body: [
        [booking.roomName, booking.checkIn, booking.checkOut, booking.total]
      ],
      headStyles: { fillColor: [15, 40, 79] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFontSize(12);
    doc.setTextColor(15, 40, 79);
    doc.text(`Total Paid: ${booking.total}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for choosing Hotel Suites!", 14, finalY + 30);
    
    doc.save(`Invoice_${booking.id}.pdf`);
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const toastId = toast.loading("Cancelling booking...");
      try {
        await api.put(`/bookings/${booking._id}/cancel`);
        toast.success("Booking cancelled successfully", { id: toastId });
        
        // Update local state to reflect cancellation
        setLocalBookings(prev => 
          prev.map(b => b._id === booking._id ? { ...b, status: "Cancelled" } : b)
        );
      } catch (error) {
        toast.error("Failed to cancel booking", { id: toastId });
      }
    }
  };

  const calculateLoyalty = (points) => {
    let currentTier = "Silver";
    let nextTier = "Gold";
    let progress = 0;
    let pointsNeeded = 0;
    let nextTierPoints = 500;
    let currentTierPoints = 0;

    if (points >= 1000) {
      currentTier = "Platinum";
      nextTier = "Max Tier";
      progress = 100;
      pointsNeeded = 0;
      nextTierPoints = 1000;
      currentTierPoints = 1000;
    } else if (points >= 500) {
      currentTier = "Gold";
      nextTier = "Platinum";
      nextTierPoints = 1000;
      currentTierPoints = 500;
      pointsNeeded = nextTierPoints - points;
      progress = ((points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100;
    } else {
      currentTier = "Silver";
      nextTier = "Gold";
      nextTierPoints = 500;
      currentTierPoints = 0;
      pointsNeeded = nextTierPoints - points;
      progress = (points / nextTierPoints) * 100;
    }

    return { currentTier, nextTier, progress, pointsNeeded };
  };

  const userPoints = user?.points || 750;
  const userTierFromBackend = user?.tier || null;
  const loyalty = calculateLoyalty(userPoints);
  const displayTier = userTierFromBackend || loyalty.currentTier;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-100">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden mb-4 relative">
                  {user.avatar ? (
                    <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#0f284f] text-white text-3xl font-bold">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#0f284f] uppercase tracking-wide">
                  {user.name || 'Guest'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "profile" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase ${activeTab === "bookings" ? "bg-[#0f284f] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#0f284f]"}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </button>
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors text-sm font-semibold tracking-wide uppercase text-red-600 hover:bg-red-50 mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3">
            
            {/* Loyalty Status Card */}
            <div className="bg-[#0f284f] text-white rounded-sm shadow-lg border border-gray-100 p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Crown className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Crown className="w-8 h-8 text-[#ffbca8]" />
                    <h2 className="text-3xl font-extrabold uppercase tracking-widest text-[#ffbca8]">
                      {displayTier} Member
                    </h2>
                  </div>
                  <p className="text-gray-300 font-medium tracking-wide mb-6">
                    Elite Guest Loyalty Program
                  </p>
                  <p className="text-4xl font-black mb-1">{userPoints.toLocaleString()} <span className="text-lg font-medium text-gray-300">PTS</span></p>
                </div>
                
                {displayTier !== "Platinum" && (
                  <div className="w-full md:w-1/2 mt-6 md:mt-0">
                    <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
                      <span>{displayTier}</span>
                      <span>{loyalty.nextTier}</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${loyalty.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[#ffbca8]"
                      />
                    </div>
                    <p className="text-sm text-right font-medium text-gray-300">
                      Earn <span className="text-[#ffbca8] font-bold">{loyalty.pointsNeeded}</span> more points for {loyalty.nextTier}!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {activeTab === "bookings" && (
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
                  Personal Booking History
                </h1>

                {localBookings.length > 0 ? (
                  <div className="space-y-6">
                    {localBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row items-center border border-gray-100 rounded-sm p-4 hover:shadow-md transition-shadow group">
                        <div className="relative w-full md:w-48 h-32 rounded-sm overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <Image src={booking.image} alt={booking.roomName} fill sizes="(max-width: 768px) 100vw, 200px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Booking #{booking.id}</span>
                              <h3 className="text-xl font-bold text-[#0f284f] uppercase tracking-wide mb-2">{booking.roomName}</h3>
                              <p className="text-gray-500 text-sm mb-1"><span className="font-semibold text-gray-700">Check-in:</span> {booking.checkIn}</p>
                              <p className="text-gray-500 text-sm mb-4 md:mb-0"><span className="font-semibold text-gray-700">Check-out:</span> {booking.checkOut}</p>
                            </div>
                            <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm mb-4 ${
                                booking.status === 'Paid' ? 'bg-[#eef2f6] text-[#0f284f]' :
                                booking.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {booking.status}
                              </span>
                              <p className="text-2xl font-black text-[#0f284f] mb-4">{booking.total}</p>
                              
                              {/* Actions Area */}
                              <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                {booking.status === 'Paid' && (
                                  <button 
                                    onClick={() => generatePDF(booking)}
                                    className="flex items-center space-x-2 text-sm font-bold text-[#0f284f] bg-[#eef2f6] hover:bg-[#e2e8f0] px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span>Invoice</span>
                                  </button>
                                )}
                                {booking.status === 'Upcoming' && (
                                  <button 
                                    onClick={() => handleCancelBooking(booking)}
                                    className="flex items-center space-x-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You have no booking history yet.</p>
                    <button className="bg-[#ffbca8] px-6 py-3 text-sm font-semibold tracking-wide text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm uppercase">
                      Book a Room
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
                  My Profile
                </h1>
                <p className="text-gray-500">Profile settings form will go here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
