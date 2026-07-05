"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Swal from "sweetalert2";

// Dashboard Components
import DashboardSidebar from "@/components/sections/dashboard/DashboardSidebar";
import DashboardLoyaltyCard from "@/components/sections/dashboard/DashboardLoyaltyCard";
import DashboardBookingsTab from "@/components/sections/dashboard/DashboardBookingsTab";
import DashboardFoodOrdersTab from "@/components/sections/dashboard/DashboardFoodOrdersTab";
import DashboardReservationsTab from "@/components/sections/dashboard/DashboardReservationsTab";
import DashboardProfileTab from "@/components/sections/dashboard/DashboardProfileTab";

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("bookings");
  
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile update state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user && !profileName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileName(user.name || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        if (activeTab === "bookings") {
          const res = await api.get("/bookings/my-bookings");
          setBookings(res.data.data || []);
        } else if (activeTab === "food_orders") {
          const res = await api.get("/food-orders/my-orders");
          setFoodOrders(res.data.data || []);
        } else if (activeTab === "reservations") {
          const res = await api.get("/reservations/my-reservations");
          setReservations(res.data.data || []);
        }
      } catch (error) {
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [activeTab, user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col h-screen sticky top-0 animate-pulse">
          <div className="px-8 py-10 border-b border-slate-100/80">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-12 bg-gray-100 rounded-xl"></div>
            ))}
          </nav>
        </aside>
        
        {/* Main Content Skeleton */}
        <main className="flex-1 w-full py-10 px-4 sm:px-8 lg:px-12 animate-pulse">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-10">
              <div className="h-10 bg-gray-200 rounded-lg w-64 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-96"></div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 min-h-[500px] p-6">
               <div className="h-10 bg-gray-100 rounded-xl mb-8 w-48"></div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1, 2, 3, 4, 5, 6].map((i) => (
                   <div key={i} className="h-48 bg-gray-50 rounded-2xl border border-gray-100"></div>
                 ))}
               </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    
    // Header Background
    doc.setFillColor(15, 40, 79);
    doc.rect(0, 0, 210, 40, 'F');

    // Header Text
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("NEXT HAVEN", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("Premium Hotel Suites", 14, 32);

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE", 165, 25);

    // Billed To Section
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${user?.name || 'Guest'}`, 14, 62);
    doc.text(`${user?.email || ''}`, 14, 67);

    // Invoice Details
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS:", 130, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: INV-${booking._id.substring(0, 8).toUpperCase()}`, 130, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 67);
    doc.text(`Status: PAID`, 130, 72);

    // Table
    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Check-in', 'Check-out', 'Total']],
      body: [
        [booking.room?.roomNumber ? `Room ${booking.room.roomNumber} - ${booking.room.title}` : (booking.room?.title || "Room"), new Date(booking.checkInDate).toLocaleDateString(), new Date(booking.checkOutDate).toLocaleDateString(), `$${Number(booking.totalAmount).toFixed(2)}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [15, 40, 79], textColor: 255, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 10, cellPadding: 6, halign: 'center' },
      columnStyles: { 0: { halign: 'left' } },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY || 120;
    
    doc.setDrawColor(220, 220, 220);
    doc.line(130, finalY + 5, 196, finalY + 5);

    doc.setFontSize(12);
    doc.setTextColor(15, 40, 79);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 130, finalY + 15);
    doc.text(`$${Number(booking.totalAmount).toFixed(2)}`, 196, finalY + 15, { align: "right" });

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 280, 196, 280);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing Next Haven. We hope you enjoy your stay!", 105, 287, { align: "center" });
    
    doc.save(`NextHaven_Invoice_${booking._id.substring(0, 8)}.pdf`);
  };

  const generateFoodOrderPDF = (order) => {
    const doc = new jsPDF();
    
    // Header Background
    doc.setFillColor(236, 72, 153); // Pink for food orders
    doc.rect(0, 0, 210, 40, 'F');

    // Header Text
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("NEXT HAVEN", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(250, 200, 220);
    doc.text("Restaurant & Dining", 14, 32);

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("RECEIPT", 165, 25);

    // Billed To Section
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${user?.name || 'Guest'}`, 14, 62);
    doc.text(`${user?.email || ''}`, 14, 67);

    // Order Details
    doc.setFont("helvetica", "bold");
    doc.text("ORDER DETAILS:", 130, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Order No: FD-${order._id.substring(0, 8).toUpperCase()}`, 130, 62);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 130, 67);
    doc.text(`Status: PAID`, 130, 72);

    const bodyData = order.items.map(item => [item.name, item.quantity, `$${Number(item.price).toFixed(2)}`, `$${(item.quantity * item.price).toFixed(2)}`]);

    autoTable(doc, {
      startY: 85,
      head: [['Item', 'Qty', 'Price', 'Subtotal']],
      body: bodyData,
      theme: 'striped',
      headStyles: { fillColor: [236, 72, 153], textColor: 255, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 10, cellPadding: 6, halign: 'center' },
      columnStyles: { 0: { halign: 'left' } },
      alternateRowStyles: { fillColor: [253, 242, 248] },
    });

    const finalY = doc.lastAutoTable.finalY || 120;

    doc.setDrawColor(220, 220, 220);
    doc.line(130, finalY + 5, 196, finalY + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(236, 72, 153);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 130, finalY + 15);
    doc.text(`$${Number(order.totalAmount).toFixed(2)}`, 196, finalY + 15, { align: "right" });
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 280, 196, 280);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for dining with Next Haven. We hope you enjoyed your meal!", 105, 287, { align: "center" });
    
    doc.save(`NextHaven_Receipt_${order._id.substring(0, 8)}.pdf`);
  };

  const handleCancelBooking = async (booking) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f284f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    });
    if (result.isConfirmed) {
      const toastId = toast.loading("Cancelling booking...");
      try {
        await api.put(`/bookings/${booking._id}/cancel`);
        toast.success("Booking cancelled successfully", { id: toastId });
        setBookings(prev => 
          prev.map(b => b._id === booking._id ? { ...b, paymentStatus: "refunded" } : b)
        );
      } catch (error) {
        toast.error("Failed to cancel booking", { id: toastId });
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const data = new FormData();
      data.append("name", profileName);
      if (profileImage) {
        data.append("avatar", profileImage);
      }

      const res = await api.put("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully", { id: toastId });
      window.location.reload(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile", { id: toastId });
    } finally {
      setIsUpdatingProfile(false);
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

  const userPoints = user?.points ?? 0;
  const userTierFromBackend = user?.tier || null;
  const loyalty = calculateLoyalty(userPoints);
  const displayTier = userTierFromBackend || loyalty.currentTier;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              logout={logout} 
            />
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3">
            
            <DashboardLoyaltyCard 
              displayTier={displayTier} 
              userPoints={userPoints} 
              loyalty={loyalty} 
            />

            {loadingData && activeTab !== "profile" ? (
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-12 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-sm"></div>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "bookings" && (
                  <DashboardBookingsTab 
                    bookings={bookings} 
                    generatePDF={generatePDF} 
                    handleCancelBooking={handleCancelBooking} 
                    router={router} 
                  />
                )}

                {activeTab === "food_orders" && (
                  <DashboardFoodOrdersTab 
                    foodOrders={foodOrders} 
                    generateFoodOrderPDF={generateFoodOrderPDF} 
                    router={router} 
                  />
                )}

                {activeTab === "reservations" && (
                  <DashboardReservationsTab 
                    reservations={reservations} 
                    router={router} 
                  />
                )}

                {activeTab === "profile" && (
                  <DashboardProfileTab 
                    profileName={profileName} 
                    setProfileName={setProfileName} 
                    setProfileImage={setProfileImage} 
                    handleProfileUpdate={handleProfileUpdate} 
                    isUpdatingProfile={isUpdatingProfile} 
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
