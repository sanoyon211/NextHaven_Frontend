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

import AdminSidebar from "@/components/sections/admin/AdminSidebar";
import AdminOverview from "@/components/sections/admin/AdminOverview";
import AdminRoomsTab from "@/components/sections/admin/AdminRoomsTab";
import AdminBookingsTab from "@/components/sections/admin/AdminBookingsTab";
import AdminFoodOrdersTab from "@/components/sections/admin/AdminFoodOrdersTab";
import AdminMenusTab from "@/components/sections/admin/AdminMenusTab";
import AdminReservationsTab from "@/components/sections/admin/AdminReservationsTab";
import AdminUsersTab from "@/components/sections/admin/AdminUsersTab";

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
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} router={router} />

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
          <AdminOverview analytics={analytics} loadingAnalytics={loadingAnalytics} />

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
                  <AdminRoomsTab 
                    rooms={rooms} 
                    openEditRoomModal={openEditRoomModal} 
                    handleDeleteRoom={handleDeleteRoom} 
                    toggleStatus={toggleStatus} 
                  />
                )}
                {activeTab === "bookings" && (
                  <AdminBookingsTab bookings={bookings} />
                )}
                {activeTab === "food_orders" && (
                  <AdminFoodOrdersTab 
                    foodOrders={foodOrders} 
                    updateFoodOrderStatus={updateFoodOrderStatus} 
                  />
                )}
                {activeTab === "menus" && (
                  <AdminMenusTab 
                    menus={menus} 
                    openEditMenuModal={openMenuModal} 
                    handleDeleteMenu={handleDeleteMenu} 
                    toggleMenuStatus={(id) => {}} 
                  />
                )}
                {activeTab === "reservations" && (
                  <AdminReservationsTab 
                    reservations={reservations} 
                    updateReservationStatus={updateReservationStatus} 
                  />
                )}
                {activeTab === "users" && (
                  <AdminUsersTab 
                    users={users} 
                    handleRoleChange={handleRoleChange} 
                  />
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