"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Section Components
import RestaurantHeroSection from "@/components/sections/restaurant/RestaurantHeroSection";
import RestaurantDiningExperienceSection from "@/components/sections/restaurant/RestaurantDiningExperienceSection";
import RestaurantChefSection from "@/components/sections/restaurant/RestaurantChefSection";
import RestaurantSignatureMenuSection from "@/components/sections/restaurant/RestaurantSignatureMenuSection";
import RestaurantAmbianceSection from "@/components/sections/restaurant/RestaurantAmbianceSection";
import RestaurantHoursReservationsSection from "@/components/sections/restaurant/RestaurantHoursReservationsSection";

export default function RestaurantPage() {
  const { user } = useAuth();
  const [signatureMenu, setSignatureMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const router = useRouter();
  
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    name: "", email: "", phone: "", date: "", time: "", guests: 2, specialRequests: ""
  });

  useEffect(() => {
    if (user) {
      setReservationForm(prev => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to make a reservation");
      router.push("/login");
      return;
    }
    setIsReserving(true);
    try {
      await api.post("/reservations", reservationForm);
      toast.success("Reservation submitted successfully!");
      setShowReservationDialog(false);
      setReservationForm(prev => ({ ...prev, phone: "", date: "", time: "", guests: 2, specialRequests: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit reservation");
    } finally {
      setIsReserving(false);
    }
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("foodCart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (item) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((i) => i._id === item._id);
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ ...item, quantity: 1 });
    }
    setCart(newCart);
    localStorage.setItem("foodCart", JSON.stringify(newCart));
    toast.success(`Added ${item.name} to cart!`);
  };

  const handleOrderNow = (item) => {
    const directOrder = [{ ...item, quantity: 1 }];
    sessionStorage.setItem("directOrder", JSON.stringify(directOrder));
    router.push("/restaurant/checkout?direct=true");
  };

  useEffect(() => {
    const fetchSignatureMenu = async () => {
      try {
        const res = await api.get('/menu?isSignature=true');
        setSignatureMenu(res.data.menuItems || res.data);
      } catch (error) {
        console.error("Failed to fetch signature menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignatureMenu();
  }, []);

  return (
    <main className="bg-white w-full overflow-hidden">
      
      <RestaurantHeroSection setShowReservationDialog={setShowReservationDialog} />
      
      <RestaurantDiningExperienceSection />
      
      <RestaurantChefSection />
      
      <RestaurantSignatureMenuSection 
        signatureMenu={signatureMenu}
        loading={loading}
        addToCart={addToCart}
        handleOrderNow={handleOrderNow}
      />
      
      <RestaurantAmbianceSection />
      
      <RestaurantHoursReservationsSection setShowReservationDialog={setShowReservationDialog} />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={() => router.push("/restaurant/checkout")}
            className="bg-[#0f284f] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-[#1a3d72] transition-all flex items-center gap-3 group"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#ffbca8] text-[#0f284f] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <span className="font-bold uppercase tracking-wide">Checkout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Reservation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-wider text-[#0f284f]">Book a Table</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReservationSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
                <input required value={reservationForm.name} onChange={e => setReservationForm({...reservationForm, name: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                <input required type="email" value={reservationForm.email} onChange={e => setReservationForm({...reservationForm, email: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</label>
                <input required value={reservationForm.phone} onChange={e => setReservationForm({...reservationForm, phone: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guests</label>
                <input required type="number" min="1" value={reservationForm.guests} onChange={e => setReservationForm({...reservationForm, guests: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
                <input required type="date" value={reservationForm.date} onChange={e => setReservationForm({...reservationForm, date: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time</label>
                <input required type="time" value={reservationForm.time} onChange={e => setReservationForm({...reservationForm, time: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-[#0f284f]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Special Requests</label>
              <textarea value={reservationForm.specialRequests} onChange={e => setReservationForm({...reservationForm, specialRequests: e.target.value})} className="w-full border border-gray-300 p-3 rounded-sm resize-none focus:outline-none focus:border-[#0f284f]" rows="2" placeholder="Optional" />
            </div>
            <button type="submit" disabled={isReserving} className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-wider py-4 rounded-sm hover:bg-[#1a3d72] transition-colors disabled:opacity-70 mt-4">
              {isReserving ? "Submitting..." : "Confirm Reservation"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
