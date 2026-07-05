"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, DollarSign, BedDouble, CalendarCheck, X, ClipboardList, Utensils, Home, Users } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("rooms");

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    availableRooms: 0,
    totalRooms: 0
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast.error("You are not authorized to view this page.");
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        if (res.data?.success) {
          setAnalytics(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === "rooms") {
          const res = await api.get("/rooms?all=true");
          setRooms(res.data.rooms || res.data);
        } else if (activeTab === "bookings") {
          const res = await api.get("/bookings");
          setBookings(res.data.data || []);
        } else if (activeTab === "food_orders") {
          const res = await api.get("/food-orders");
          setFoodOrders(res.data.data || []);
        } else if (activeTab === "menus") {
          const res = await api.get("/menu");
          setMenus(res.data.menuItems || []);
        } else if (activeTab === "reservations") {
          const res = await api.get("/reservations");
          setReservations(res.data.data || []);
        } else if (activeTab === "users") {
          const res = await api.get("/admin/users");
          setUsers(res.data.data || []);
        }
      } catch (error) {
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const [formData, setFormData] = useState({
    title: "",
    roomNumber: "",
    type: "Standard",
    price: "",
    capacity: "",
    description: "",
  });
  const [amenities, setAmenities] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Menu Form State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    category: "Starters",
    price: "",
    description: "",
    ingredients: "",
    isSignature: false,
  });
  const [menuImageFile, setMenuImageFile] = useState(null);

  const toggleStatus = async (id) => {
    try {
      const room = rooms.find(r => (r._id === id || r.id === id));
      if (!room) return;
      const newStatus = room.status === "available" ? "maintenance" : "available";

      await api.put(`/rooms/${id}/status`, { status: newStatus });

      setRooms(rooms.map(r => {
        if (r._id === id || r.id === id) {
          return { ...r, status: newStatus };
        }
        return r;
      }));
      toast.success(`Room status changed to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update room status");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success(`User role updated to ${newRole}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const updateFoodOrderStatus = async (id, status) => {
    try {
      await api.put(`/food-orders/${id}/status`, { orderStatus: status });
      setFoodOrders(foodOrders.map(order =>
        order._id === id ? { ...order, orderStatus: status } : order
      ));
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations(reservations.map(res =>
        res._id === id ? { ...res, status } : res
      ));
      toast.success(`Reservation status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAmenityChange = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const openEditRoomModal = (room) => {
    setEditingRoomId(room._id || room.id);
    setFormData({
      title: room.title || "",
      roomNumber: room.roomNumber || "",
      type: room.roomType || room.type || "Standard",
      price: room.pricePerNight || room.price || "",
      capacity: room.capacity || "",
      description: room.description || "",
    });
    setAmenities(room.amenities || []);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f284f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter(r => r._id !== id && r.id !== id));
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingRoomId ? "Updating room..." : "Creating room...");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("roomNumber", formData.roomNumber);
      data.append("roomType", formData.type);
      data.append("price", formData.price);
      data.append("capacity", formData.capacity);
      data.append("description", formData.description);
      data.append("amenities", amenities.join(","));

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingRoomId) {
        const res = await api.put(`/rooms/${editingRoomId}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Room updated successfully!", { id: toastId });
        setIsModalOpen(false);
        const updatedRoom = res.data.room || res.data;
        setRooms(rooms.map(r => (r._id === editingRoomId || r.id === editingRoomId) ? updatedRoom : r));
      } else {
        const res = await api.post("/rooms", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Room created successfully!", { id: toastId });
        setIsModalOpen(false);
        const newRoom = res.data.room || res.data;
        setRooms([newRoom, ...rooms]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save room.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingMenuId ? "Updating menu item..." : "Creating menu item...");

    try {
      const data = new FormData();
      data.append("name", menuFormData.name);
      data.append("category", menuFormData.category);
      data.append("price", menuFormData.price);
      data.append("description", menuFormData.description);
      data.append("ingredients", menuFormData.ingredients);
      data.append("isSignature", menuFormData.isSignature);

      if (menuImageFile) {
        data.append("image", menuImageFile);
      }

      let res;
      if (editingMenuId) {
        res = await api.put(`/menu/${editingMenuId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        setMenus(menus.map(m => m._id === editingMenuId ? res.data.menuItem : m));
        toast.success("Menu item updated!", { id: toastId });
      } else {
        res = await api.post("/menu", data, { headers: { "Content-Type": "multipart/form-data" } });
        setMenus([res.data.menuItem, ...menus]);
        toast.success("Menu item created!", { id: toastId });
      }
      setIsMenuModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save menu item.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMenuModal = (menuItem = null) => {
    if (menuItem) {
      setEditingMenuId(menuItem._id);
      setMenuFormData({
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        description: menuItem.description,
        ingredients: menuItem.ingredients,
        isSignature: menuItem.isSignature,
      });
    } else {
      setEditingMenuId(null);
      setMenuFormData({
        name: "",
        category: "Starters",
        price: "",
        description: "",
        ingredients: "",
        isSignature: false,
      });
    }
    setMenuImageFile(null);
    setIsMenuModalOpen(true);
  };

  const handleDeleteMenu = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f284f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/menu/${id}`);
      setMenus(menus.filter(m => m._id !== id));
      toast.success("Menu item deleted");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col h-screen sticky top-0 animate-pulse">
          <div className="px-8 py-10 border-b border-slate-100/80">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <nav className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-12 bg-gray-100 rounded-xl"></div>
            ))}
          </nav>
        </aside>
        
        {/* Main Content Skeleton */}
        <main className="flex-1 w-full py-10 px-4 sm:px-8 lg:px-12 animate-pulse">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="h-10 bg-gray-200 rounded-lg w-64 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-96"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-xl w-36"></div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 h-32">
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 min-h-[500px] p-6">
               <div className="h-10 bg-gray-100 rounded-xl mb-8 w-48"></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                   <div key={i} className="h-64 bg-gray-50 rounded-2xl border border-gray-100"></div>
                 ))}
               </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar - Premium Soft Design */}
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
            {[
              { id: "rooms", icon: BedDouble, label: "Rooms" },
              { id: "bookings", icon: ClipboardList, label: "Bookings" },
              { id: "food_orders", icon: Utensils, label: "Food Orders" },
              { id: "menus", icon: ClipboardList, label: "Menu Items" },
              { id: "reservations", icon: CalendarCheck, label: "Reservations" },
              { id: "users", icon: Users, label: "Users" }
            ].map((tab) => (
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

      {/* Main Content */}
      <main className="flex-1 w-full py-10 px-4 sm:px-8 lg:px-12 relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Mobile Navigation (Scrollable Tabs) */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide border-b border-slate-100 items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1 shrink-0"></div>
            {[
              { id: "rooms", icon: BedDouble, label: "Rooms" },
              { id: "bookings", icon: ClipboardList, label: "Bookings" },
              { id: "food_orders", icon: Utensils, label: "Food Orders" },
              { id: "menus", icon: ClipboardList, label: "Menu Items" },
              { id: "reservations", icon: CalendarCheck, label: "Reservations" },
              { id: "users", icon: Users, label: "Users" }
            ].map((tab) => (
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

          {/* Header Section */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard Overview
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage your properties, bookings, and services seamlessly.</p>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "rooms" && (
                <button
                  onClick={() => {
                    setEditingRoomId(null);
                    setFormData({ title: "", roomNumber: "", type: "Standard", price: "", capacity: "", description: "" });
                    setAmenities([]);
                    setImageFile(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center space-x-2 bg-[#0f284f] text-white font-medium px-5 py-2.5 rounded-xl hover:bg-[#1a3d72] transition-all hover:shadow-lg hover:shadow-[#0f284f]/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Room</span>
                </button>
              )}
              {activeTab === "menus" && (
                <button
                  onClick={() => openMenuModal()}
                  className="flex items-center space-x-2 bg-[#0f284f] text-white font-medium px-5 py-2.5 rounded-xl hover:bg-[#1a3d72] transition-all hover:shadow-lg hover:shadow-[#0f284f]/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Analytics Cards with subtle hover animations */}
          <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { title: "Total Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Active Bookings", value: analytics.activeBookings, icon: CalendarCheck, color: "text-[#0f284f]", bg: "bg-[#0f284f]/10" },
              { title: "Rooms Available", value: analytics.availableRooms, icon: BedDouble, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Total Rooms", value: analytics.totalRooms, icon: Home, color: "text-purple-600", bg: "bg-purple-50" }
            ].map((stat, index) => (
              <motion.div variants={fadeUp} key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-3 md:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <p className="text-xs md:text-sm font-semibold text-slate-500">{stat.title}</p>
                  <div className={`p-2.5 ${stat.bg} rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
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

          {/* Tab Content Table Wrapper */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden min-h-[400px]">
            {loadingData ? (
              <div className="p-6 animate-pulse">
                <div className="h-10 bg-gray-100 rounded mb-6"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded mb-2 border border-gray-100"></div>
                ))}
              </div>
            ) : (
              <>
                {activeTab === "rooms" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {rooms.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No rooms found.</div>}
                    {rooms.map((room) => (
                      <div key={room._id || room.id} className="bg-white shadow-sm hover:shadow-xl rounded-lg overflow-hidden group border border-gray-100 transition-all relative">
                        <div className="h-48 md:h-60 overflow-hidden relative bg-gray-100">
                          <Image
                            src={(room.images && room.images.length > 0) ? room.images[0] : (room.image || room.imageUrl || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000")}
                            alt={room.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => openEditRoomModal(room)} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteRoom(room._id || room.id)} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg shadow-sm transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            {room.isOccupiedToday ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/90 backdrop-blur-sm text-blue-700 border border-blue-200">
                                Booked
                              </span>
                            ) : (
                              <button
                                onClick={() => toggleStatus(room._id || room.id)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all border backdrop-blur-sm ${room.status?.toLowerCase() === "available"
                                    ? "bg-emerald-50/90 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-rose-50/90 text-rose-700 border-rose-200 hover:bg-rose-100"
                                  }`}
                              >
                                {room.status}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="p-5 md:p-6 flex flex-col flex-1">
                          <h3 className="text-[#0f284f] font-extrabold uppercase text-base md:text-lg mb-1 md:mb-2 truncate" title={room.title}>
                            {room.roomNumber ? `ROOM ${room.roomNumber} - ${room.title}` : room.title}
                          </h3>
                          <div className="flex justify-between items-end mt-4 md:mt-6 pt-4 border-t border-slate-100 mt-auto">
                            <p className="text-gray-500 text-xs w-1/2 leading-relaxed font-medium">
                              {room.capacity ? `${room.capacity} adults` : '2 adults'} / {room.roomType?.toLowerCase() || room.type?.toLowerCase() || 'standard'}
                            </p>
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                From
                              </p>
                              <p className="text-xl md:text-2xl font-black text-[#0f284f]">
                                ${room.price || room.pricePerNight}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Similar refined styling for Bookings Table */}
                {activeTab === "bookings" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {bookings.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No bookings found.</div>}
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                          <span className="font-mono text-sm font-bold text-[#0f284f]">#{booking._id.substring(0, 8).toUpperCase()}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Guest Name</p>
                            <p className="text-sm font-bold text-slate-900">{booking.user?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Room Info</p>
                            <p className="text-sm font-semibold text-slate-800 truncate" title={booking.room?.title}>
                              {booking.room ? (
                                <>
                                  {booking.room.roomNumber ? `Room ${booking.room.roomNumber}` : 'Room'} • <span className="text-slate-600 font-normal">{booking.room.title || 'Unknown Room'}</span>
                                </>
                              ) : (
                                <span className="text-rose-500 italic">Room Deleted</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Duration</p>
                            <p className="text-sm font-medium text-slate-700">
                              {new Date(booking.checkInDate).toLocaleDateString()} <span className="text-slate-400 mx-1">→</span> {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                          <span className="text-lg font-black text-[#0f284f]">${booking.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Food Orders Table */}
                {activeTab === "food_orders" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {foodOrders.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No food orders found.</div>}
                    {foodOrders.map((order) => (
                      <div key={order._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                          <span className="font-mono text-sm font-bold text-[#0f284f]">#{order._id.substring(0, 8).toUpperCase()}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : order.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="flex-1 space-y-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Customer & Location</p>
                            <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Unknown'}</p>
                            <p className="text-xs font-medium text-slate-600 mt-1 flex items-start gap-1">
                              <span className="text-slate-400">📍</span> {order.deliveryLocation || 'N/A'}
                            </p>
                            {order.orderNotes && <p className="text-xs text-slate-500 mt-1.5 italic bg-slate-50 p-2 rounded-lg border border-slate-100">📝 {order.orderNotes}</p>}
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Ordered Items</p>
                            <div className="flex flex-wrap gap-1.5">
                              {order.items.map(i => (
                                <span key={i._id || i.name} className="inline-block bg-white text-slate-700 px-2 py-1 rounded text-xs font-medium border border-slate-200 shadow-sm">
                                  {i.quantity}x {i.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 mt-auto">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-lg font-black text-[#0f284f]">${order.totalAmount}</span>
                          </div>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateFoodOrderStatus(order._id, e.target.value)}
                            className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-[#0f284f] focus:bg-white focus:ring-2 focus:ring-[#0f284f]/10 cursor-pointer transition-all"
                          >
                            <option value="preparing">👨‍🍳 Preparing</option>
                            <option value="ready">🛎️ Ready</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Menus Table */}
                {activeTab === "menus" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {menus.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No menu items found.</div>}
                    {menus.map((item) => (
                      <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col hover:shadow-md transition-all group">
                        <div className="relative h-32 md:h-40 w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80"}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {item.isSignature && (
                            <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              Signature
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 shadow-sm">
                            {item.category}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2" title={item.name}>{item.name}</h3>
                          <div className="flex justify-between items-end mt-auto pt-4">
                            <span className="text-xl md:text-2xl font-black text-emerald-600">
                              ${String(item.price).replace('$', '')}
                            </span>
                            <div className="flex gap-1.5">
                              <button onClick={() => openMenuModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors shadow-sm border border-transparent hover:border-blue-100">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteMenu(item._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors shadow-sm border border-transparent hover:border-rose-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reservations Table */}
                {activeTab === "reservations" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {reservations.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No reservations found.</div>}
                    {reservations.map((res) => (
                      <div key={res._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                          <span className="font-mono text-sm font-bold text-[#0f284f]">#{res._id.substring(0, 8).toUpperCase()}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : res.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {res.status}
                          </span>
                        </div>
                        <div className="flex-1 space-y-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Guest Details</p>
                            <p className="text-sm font-bold text-slate-900">{res.name}</p>
                            <div className="flex flex-col gap-1 mt-1.5">
                              <span className="text-xs text-slate-600 flex items-center gap-1.5"><span className="text-slate-400">✉️</span> {res.email}</span>
                              <span className="text-xs text-slate-600 flex items-center gap-1.5"><span className="text-slate-400">📞</span> {res.phone}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Reservation Info</p>
                            <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                              <span className="text-slate-400">📅</span> {new Date(res.date).toLocaleDateString()} at {res.time}
                            </p>
                            <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5 mt-1">
                              <span className="text-slate-400">👥</span> {res.guests} people
                            </p>
                            {res.specialRequests && <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">📝 {res.specialRequests}</p>}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-auto">
                          <select
                            value={res.status}
                            onChange={(e) => updateReservationStatus(res._id, e.target.value)}
                            className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-[#0f284f] focus:bg-white focus:ring-2 focus:ring-[#0f284f]/10 cursor-pointer transition-all"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Users UI Grid */}
                {activeTab === "users" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
                    {users.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No users found.</div>}
                    {users.map((u) => (
                      <div key={u._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${u.role === 'admin' ? 'bg-purple-500' : 'bg-slate-200 group-hover:bg-[#0f284f]'}`}></div>
                        <div className="flex items-start gap-4 mb-4 pl-1">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                            {u.avatar ? (
                              <Image src={u.avatar} alt={u.name} width={48} height={48} className="object-cover" />
                            ) : (
                              <span className="text-[#0f284f] font-bold text-lg">{u.name ? u.name.charAt(0).toUpperCase() : '?'}</span>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-900 truncate" title={u.name}>{u.name}</h3>
                            <p className="text-xs text-slate-500 truncate" title={u.email}>{u.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4 pl-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {u.tier || 'Silver'}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <span className="text-[#ffbca8]">★</span> {u.points || 0} pts
                          </span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-auto pl-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Role Access</label>
                          <select
                            value={u.role || 'guest'}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className={`w-full text-sm border rounded-lg p-2.5 font-semibold focus:outline-none cursor-pointer transition-all ${
                              u.role === 'admin' 
                                ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-2 focus:ring-purple-500/20' 
                                : 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-2 focus:ring-[#0f284f]/10'
                            }`}
                          >
                            <option value="guest">Guest / Customer</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Modernized Room Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all"
              >
              <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingRoomId ? "Edit Room Details" : "Create New Room"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 shadow-sm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Room Title</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                      placeholder="e.g. Ocean View Suite"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Room Number</label>
                    <input
                      type="text" required value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                      placeholder="e.g. 101"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Room Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all cursor-pointer"
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Suite">Suite</option>
                      <option value="Deluxe">Deluxe</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Price per Night ($)</label>
                    <input
                      type="number" required min="0" value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                      placeholder="250"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Capacity</label>
                    <input
                      type="number" required min="1" value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                      placeholder="2"
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    required rows="3" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all resize-none"
                    placeholder="Describe the room features..."
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Amenities</label>
                  <div className="flex flex-wrap gap-3">
                    {["WiFi", "AC", "Breakfast", "Swimming Pool", "Mini Bar", "Gym"].map((item) => (
                      <label key={item} className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-xl border transition-colors ${amenities.includes(item) ? 'bg-[#0f284f]/5 border-[#0f284f]/30' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          checked={amenities.includes(item)}
                          onChange={() => handleAmenityChange(item)}
                          className="rounded border-slate-300 text-[#0f284f] focus:ring-[#0f284f] w-4 h-4 cursor-pointer"
                        />
                        <span className={`text-sm font-medium ${amenities.includes(item) ? 'text-[#0f284f]' : 'text-slate-600'}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Room Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-[#0f284f] file:border file:border-slate-200 file:shadow-sm hover:file:bg-slate-50 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end space-x-3 border-t border-slate-100">
                  <button
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#0f284f] rounded-xl text-sm font-semibold text-white shadow-sm hover:bg-[#1a3d72] hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : (editingRoomId ? "Update Room" : "Create Room")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Modernized Menu Modal */}
        <AnimatePresence>
        {isMenuModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all"
            >
              <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingMenuId ? "Edit Menu Item" : "Create Menu Item"}
                </h2>
                <button
                  onClick={() => setIsMenuModalOpen(false)}
                  className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 shadow-sm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMenuSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Dish Name</label>
                    <input
                      type="text" required value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select
                      value={menuFormData.category}
                      onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all cursor-pointer"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Courses">Main Courses</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Price (e.g. 12.99)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                      <input
                        type="text" required value={menuFormData.price}
                        onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 pl-8 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex items-center mt-7">
                    <label className="flex items-center space-x-3 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 w-full hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={menuFormData.isSignature}
                        onChange={(e) => setMenuFormData({ ...menuFormData, isSignature: e.target.checked })}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-5 h-5 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700">🌟 Mark as Signature Item</span>
                    </label>
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    required rows="2" value={menuFormData.description}
                    onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Key Ingredients</label>
                  <textarea
                    required rows="2" value={menuFormData.ingredients}
                    onChange={(e) => setMenuFormData({ ...menuFormData, ingredients: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:bg-white focus:outline-none focus:border-[#0f284f] focus:ring-4 focus:ring-[#0f284f]/10 transition-all resize-none"
                    placeholder="e.g. Tomatoes, Basil, Mozzarella"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Dish Image {editingMenuId && <span className="text-slate-400 font-normal">(Optional)</span>}</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <input
                      type="file" accept="image/*" required={!editingMenuId}
                      onChange={(e) => setMenuImageFile(e.target.files[0])}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-[#0f284f] file:border file:border-slate-200 file:shadow-sm hover:file:bg-slate-50 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end space-x-3 border-t border-slate-100">
                  <button
                    type="button" onClick={() => setIsMenuModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#0f284f] rounded-xl text-sm font-semibold text-white shadow-sm hover:bg-[#1a3d72] hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Menu Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

      </main>
    </div>
  );
}