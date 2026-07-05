"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Leaf, WheatOff, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import toast from "react-hot-toast";
// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AllMenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const router = require("next/navigation").useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("foodCart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenuItems(res.data.menuItems || res.data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="bg-[#f8fafc] w-full min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Categories Banner */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-16"
        >
          {[
            {
              name: "Starters",
              img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800",
            },
            {
              name: "Signature Mains",
              img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
            },
            {
              name: "Desserts",
              img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800",
            },
            {
              name: "Cocktails",
              img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
            },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="relative h-32 rounded-lg overflow-hidden group cursor-pointer shadow-sm"
            >
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-2">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm md:text-base drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Header & Search */}
        <div className="text-center mb-8 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[#0f284f] text-4xl md:text-5xl font-bold uppercase tracking-widest mb-6 drop-shadow-sm">
              Our Exquisite Menu
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore our full selection of culinary masterpieces. Use the
              search bar below to find your favorite dish.
            </p>

            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white border-gray-200 shadow-sm rounded-full text-base focus-visible:ring-[#0f284f]"
              />
            </div>
          </motion.div>
        </div>

        {/* Menu Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {loading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="relative h-48 md:h-64 w-full bg-slate-200/60">
                    <div className="absolute top-4 left-4 bg-white/80 h-6 w-16 rounded-sm"></div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="h-6 md:h-7 bg-slate-200 rounded w-2/3"></div>
                      <div className="h-7 md:h-8 bg-slate-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-slate-200/80 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200/80 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </>
          ) : filteredMenu.length === 0 ? (
            <div className="col-span-full flex justify-center py-12 md:py-20">
              <p className="text-gray-500 text-lg">No menu items found.</p>
            </div>
          ) : (
            filteredMenu.map((item) => (
              <Dialog key={item._id}>
                <DialogTrigger
                  nativeButton={false}
                  render={
                    <motion.div
                      variants={fadeUp}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer group transition-all text-left"
                    />
                  }
                >
                  <div className="relative h-48 md:h-64 w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
                      <span className="text-xs font-bold text-[#0f284f] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="text-[#0f284f] text-base md:text-xl font-bold uppercase tracking-wide pr-2 md:pr-4">
                        {item.name}
                      </h3>
                      <p className="text-xl md:text-2xl font-black text-[#0f284f]">
                        {item.price}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                      <DialogHeader className="text-left mb-6">
                        <span className="text-xs font-bold text-[#ffbca8] uppercase tracking-wider mb-2 block">
                          {item.category}
                        </span>
                        <DialogTitle className="text-[#0f284f] text-3xl font-extrabold uppercase tracking-wide">
                          {item.name}
                        </DialogTitle>
                      </DialogHeader>

                      <p className="text-2xl font-black text-[#0f284f] mb-6 border-b border-gray-100 pb-6">
                        {item.price}
                      </p>

                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                            Details
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                            Ingredients
                          </h4>
                          <p className="text-gray-500 text-sm leading-relaxed italic">
                            {item.ingredients}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => addToCart(item)}
                          className="flex-1 bg-white border-2 border-[#0f284f] text-[#0f284f] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-slate-50 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleOrderNow(item)}
                          className="flex-1 bg-[#0f284f] border-2 border-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))
          )}
        </motion.div>

        {/* Dietary Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="relative h-[400px] md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1500"
              alt="Fresh vegetables and ingredients"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <h2 className="text-[#0f284f] text-2xl md:text-3xl font-bold uppercase tracking-wider mb-6">
              Dietary Preferences & Allergies
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Our culinary team is dedicated to providing an exceptional dining
              experience for all our guests. We are more than happy to
              accommodate a variety of dietary requirements and food allergies
              without compromising on flavor or presentation.
            </p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-[#eef2f6] p-3 rounded-full mr-4">
                  <Leaf className="w-6 h-6 text-[#0f284f]" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold uppercase tracking-wide text-sm">
                    Vegan & Vegetarian
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Plant-based menus available upon request.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-[#eef2f6] p-3 rounded-full mr-4">
                  <WheatOff className="w-6 h-6 text-[#0f284f]" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold uppercase tracking-wide text-sm">
                    Gluten & Nut-Free
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Strict cross-contamination protocols in place.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-400 italic">
              Please inform your server of any allergies prior to ordering.
            </p>
          </div>
        </motion.div>
      </div>

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
    </main>
  );
}
