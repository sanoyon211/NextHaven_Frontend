"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, DollarSign, BedDouble, CalendarCheck, X, ClipboardList, Utensils, Home } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("rooms");
  
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [menus, setMenus] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    availableRooms: 0
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
          const res = await api.get("/rooms");
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

  const toggleStatus = (id) => {
    setRooms(rooms.map(room => {
      if (room._id === id || room.id === id) {
        const newStatus = room.status === "Available" ? "Maintenance" : "Available";
        toast(`Room status changed to ${newStatus}`, { icon: '🔄' });
        return { ...room, status: newStatus };
      }
      return room;
    }));
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

  const handleAmenityChange = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Creating room...");

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

      const res = await api.post("/rooms", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      toast.success("Room created successfully!", { id: toastId });
      setIsModalOpen(false);
      const newRoom = res.data.room || res.data;
      setRooms([newRoom, ...rooms]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room.", { id: toastId });
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
    if (!confirm("Are you sure you want to delete this item?")) return;
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f284f]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex sticky top-0 h-screen overflow-y-auto">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-extrabold text-[#0f284f] uppercase tracking-wider">
              NextHaven
            </h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Admin Panel</p>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("rooms")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-colors rounded-sm ${
                activeTab === "rooms"
                  ? "bg-[#0f284f] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BedDouble className="w-4 h-4" /> Rooms
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-colors rounded-sm ${
                activeTab === "bookings"
                  ? "bg-[#0f284f] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Bookings
            </button>
            <button
              onClick={() => setActiveTab("food_orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-colors rounded-sm ${
                activeTab === "food_orders"
                  ? "bg-[#0f284f] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Utensils className="w-4 h-4" /> Food Orders
            </button>
            <button
              onClick={() => setActiveTab("menus")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-colors rounded-sm ${
                activeTab === "menus"
                  ? "bg-[#0f284f] text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Menu Items
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-colors rounded-sm text-gray-500 hover:text-[#0f284f] hover:bg-gray-50"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider">
            Admin Dashboard
          </h1>
          {activeTab === "rooms" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-[#0f284f] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#1a3d72] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Room</span>
            </button>
          )}
          {activeTab === "menus" && (
            <button 
              onClick={() => openMenuModal()}
              className="flex items-center space-x-2 bg-[#0f284f] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#1a3d72] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Menu Item</span>
            </button>
          )}
        </div>

        {/* Top Section: Revenue Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 text-green-700 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-[#0f284f]">
                {loadingAnalytics ? "..." : `$${analytics.totalRevenue.toLocaleString()}`}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-full">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Bookings</p>
              <p className="text-3xl font-black text-[#0f284f]">
                {loadingAnalytics ? "..." : analytics.activeBookings}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-purple-100 text-purple-700 rounded-full">
              <BedDouble className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Rooms Available</p>
              <p className="text-3xl font-black text-[#0f284f]">
                {loadingAnalytics ? "..." : analytics.availableRooms}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          {loadingData ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f284f]"></div>
            </div>
          ) : (
            <>
              {activeTab === "rooms" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4 font-bold">Image</th>
                        <th className="p-4 font-bold">Room #</th>
                        <th className="p-4 font-bold">Title</th>
                        <th className="p-4 font-bold">Type</th>
                        <th className="p-4 font-bold">Price</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No rooms found.</td></tr>}
                      {rooms.map((room) => (
                        <tr key={room._id || room.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="relative w-20 h-14 rounded-sm overflow-hidden">
                              <Image
                                src={room.image || room.imageUrl || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80"}
                                alt={room.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-4 font-bold text-gray-800">{room.roomNumber}</td>
                          <td className="p-4 font-bold text-gray-800">{room.title}</td>
                          <td className="p-4 text-sm text-gray-600">{room.roomType || room.type}</td>
                          <td className="p-4 text-sm font-bold text-gray-900">${room.price || room.pricePerNight}</td>
                          <td className="p-4">
                            <button 
                              onClick={() => toggleStatus(room._id || room.id)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                                room.status?.toLowerCase() === "available" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {room.status}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button className="p-2 text-gray-500 hover:text-[#0f284f] hover:bg-blue-50 rounded-full transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4 font-bold">Booking ID</th>
                        <th className="p-4 font-bold">Guest</th>
                        <th className="p-4 font-bold">Room</th>
                        <th className="p-4 font-bold">Dates</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No bookings found.</td></tr>}
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono text-sm text-gray-500">{booking._id.substring(0, 8).toUpperCase()}</td>
                          <td className="p-4 font-bold text-gray-800">{booking.user?.name || 'Unknown'}</td>
                          <td className="p-4 text-sm text-gray-600">{booking.room?.title || 'Unknown Room'}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-900">${booking.totalAmount}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "food_orders" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4 font-bold">Order ID</th>
                        <th className="p-4 font-bold">Customer</th>
                        <th className="p-4 font-bold">Items</th>
                        <th className="p-4 font-bold">Location</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodOrders.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-gray-500">No food orders found.</td></tr>}
                      {foodOrders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono text-sm text-gray-500">{order._id.substring(0, 8).toUpperCase()}</td>
                          <td className="p-4 font-bold text-gray-800">{order.user?.name || 'Unknown'}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </td>
                          <td className="p-4 text-sm text-gray-800 font-medium">
                            <div>{order.deliveryLocation || 'N/A'}</div>
                            {order.orderNotes && <div className="text-xs text-gray-500 mt-1 italic">Note: {order.orderNotes}</div>}
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-900">${order.totalAmount}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => updateFoodOrderStatus(order._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:border-[#0f284f]"
                            >
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "menus" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4 font-bold">Image</th>
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold">Price</th>
                        <th className="p-4 font-bold">Signature</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menus.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No menu items found.</td></tr>}
                      {menus.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="relative w-16 h-12 rounded-sm overflow-hidden">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-4 font-bold text-gray-800">{item.name}</td>
                          <td className="p-4 text-sm text-gray-600">{item.category}</td>
                          <td className="p-4 text-sm font-bold text-gray-900">{item.price}</td>
                          <td className="p-4">
                            {item.isSignature ? <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-sm">Yes</span> : <span className="text-gray-400 text-sm">No</span>}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => openMenuModal(item)} className="p-2 text-gray-500 hover:text-[#0f284f] hover:bg-blue-50 rounded-full transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteMenu(item._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add New Room Modal (Code omitted for brevity, keeping existing modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-[#0f284f] uppercase tracking-wider">
                Create New Room
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Room Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                    placeholder="e.g. Ocean View Suite"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Room Number</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                    placeholder="e.g. 101"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all bg-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price per Night ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                    placeholder="250"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                    placeholder="2"
                  />
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all resize-none"
                  placeholder="Describe the room features..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Amenities</label>
                <div className="flex flex-wrap gap-4">
                  {["WiFi", "AC", "Breakfast", "Swimming Pool", "Mini Bar", "Gym"].map((item) => (
                    <label key={item} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={amenities.includes(item)}
                        onChange={() => handleAmenityChange(item)}
                        className="rounded-sm border-gray-300 text-[#0f284f] focus:ring-[#0f284f]"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Room Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0f284f] file:text-white hover:file:bg-[#1a3d72] transition-all cursor-pointer"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#0f284f] rounded-sm text-sm font-bold text-white uppercase tracking-wider hover:bg-[#1a3d72] transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-[#0f284f] uppercase tracking-wider">
                {editingMenuId ? "Edit Menu Item" : "Create Menu Item"}
              </h2>
              <button 
                onClick={() => setIsMenuModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleMenuSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    required
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData({...menuFormData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <select
                    value={menuFormData.category}
                    onChange={(e) => setMenuFormData({...menuFormData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all bg-white"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (e.g. $12.99)</label>
                  <input
                    type="text"
                    required
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData({...menuFormData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all"
                  />
                </div>
                
                <div className="space-y-1 flex items-center mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={menuFormData.isSignature}
                      onChange={(e) => setMenuFormData({...menuFormData, isSignature: e.target.checked})}
                      className="rounded-sm border-gray-300 text-[#0f284f] focus:ring-[#0f284f] w-5 h-5"
                    />
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Is Signature Item?</span>
                  </label>
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <textarea
                  required
                  rows="2"
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all resize-none"
                ></textarea>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ingredients</label>
                <textarea
                  required
                  rows="2"
                  value={menuFormData.ingredients}
                  onChange={(e) => setMenuFormData({...menuFormData, ingredients: e.target.value})}
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#0f284f] transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image {editingMenuId && "(Optional)"}</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingMenuId}
                  onChange={(e) => setMenuImageFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0f284f] file:text-white hover:file:bg-[#1a3d72] transition-all cursor-pointer"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#0f284f] rounded-sm text-sm font-bold text-white uppercase tracking-wider hover:bg-[#1a3d72] transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Menu Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
