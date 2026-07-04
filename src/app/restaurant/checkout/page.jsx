"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("foodCart");
    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("foodCart", JSON.stringify(newCart));
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
    toast.success("Item removed");
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    const item = newCart[index];
    if (item.quantity + delta > 0) {
      item.quantity += delta;
      updateCart(newCart);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    let price = item.price;
    if (typeof price === "string") {
      price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    }
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!deliveryLocation.trim()) {
      toast.error("Please enter a delivery location");
      return;
    }
    setIsProcessing(true);
    try {
      // Prepare items for backend
      const items = cart.map(item => ({
        menuItem: item._id,
        quantity: item.quantity
      }));

      const res = await api.post("/food-orders/checkout", { 
        items,
        deliveryLocation,
        orderNotes
      });
      
      if (res.data?.clientSecret) {
        router.push(`/payment?clientSecret=${res.data.clientSecret}&amount=${res.data.amount}`);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to proceed to checkout";
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0f284f] mb-4 uppercase tracking-wide">Your Cart is Empty</h2>
        <button
          onClick={() => router.push("/restaurant/all-menu")}
          className="flex items-center gap-2 text-[#0f284f] font-bold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/restaurant/all-menu")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0f284f] transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Menu
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f284f] uppercase tracking-wider mb-10">
          Checkout
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6 border-b border-gray-100 pb-4">
              Order Summary
            </h2>

            <div className="space-y-6">
              {cart.map((item, index) => {
                let price = item.price;
                if (typeof price === "string") {
                  price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
                }
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex-1 w-full">
                      <h3 className="font-bold text-[#0f284f] text-lg uppercase tracking-wide">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-8">
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(index, -1)}
                          className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                        >-</button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(index, 1)}
                          className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                        >+</button>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <span className="font-black text-[#0f284f] text-lg">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Delivery Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Room 101 or Table 5"
                  className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-[#0f284f] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Less spicy, Extra ketchup..."
                  className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-[#0f284f] transition-colors resize-none"
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#fcfdfd] p-6 md:p-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-semibold uppercase tracking-wider text-sm">Total Amount</span>
              <span className="text-3xl font-black text-[#0f284f]">${totalAmount.toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                "Pay with Stripe"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
