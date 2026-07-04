"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, DollarSign, BedDouble, CalendarCheck, X } from "lucide-react";
import api from "@/lib/api";

const INITIAL_ROOMS = [
  { id: 1, title: "Standard Room", type: "Standard", price: "$59", status: "Available", image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=500" },
  { id: 2, title: "Superior Room", type: "Superior", price: "$79", status: "Maintenance", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=500" },
  { id: 3, title: "Deluxe Room", type: "Deluxe", price: "$129", status: "Available", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500" },
  { id: 4, title: "Executive Suite", type: "Suite", price: "$199", status: "Available", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=500" },
];

export default function AdminDashboard() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    availableRooms: 0
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

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

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "Standard",
    price: "",
    capacity: "",
    description: "",
  });
  const [amenities, setAmenities] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const toggleStatus = (id) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        const newStatus = room.status === "Available" ? "Maintenance" : "Available";
        toast(`Room status changed to ${newStatus}`, { icon: '🔄' });
        return { ...room, status: newStatus };
      }
      return room;
    }));
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
      data.append("roomType", formData.type);
      data.append("price", formData.price);
      data.append("capacity", formData.capacity);
      data.append("description", formData.description);
      // Append amenities as a comma-separated string or multiple fields depending on backend
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
      
      // Update local state to reflect the newly created room
      const newRoom = res.data.room || res.data;
      setRooms([newRoom, ...rooms]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create room.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] w-full py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-[#032c28] uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-[#032c28] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#043e39] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Room</span>
          </button>
        </div>

        {/* Top Section: Revenue Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 text-green-700 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-[#032c28]">
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
              <p className="text-3xl font-black text-[#032c28]">
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
              <p className="text-3xl font-black text-[#032c28]">
                {loadingAnalytics ? "..." : analytics.availableRooms}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Room Management Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-[#032c28] text-xl font-bold uppercase tracking-wider">
              Room Management
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#032c28] border-b border-gray-200 uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">Image</th>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-20 h-14 rounded-sm overflow-hidden">
                        <Image
                          src={room.image}
                          alt={room.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{room.title}</td>
                    <td className="p-4 text-sm text-gray-600">{room.type}</td>
                    <td className="p-4 text-sm font-bold text-gray-900">{room.price}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(room.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          room.status === "Available" 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {room.status}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => toast("Edit functionality coming soon")}
                        className="p-2 text-gray-500 hover:text-[#032c28] hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast.error("Delete functionality coming soon")}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-[#032c28] uppercase tracking-wider">
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
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#032c28] transition-all"
                    placeholder="e.g. Ocean View Suite"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#032c28] transition-all bg-white"
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
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#032c28] transition-all"
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
                    className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#032c28] transition-all"
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
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-[#032c28] transition-all resize-none"
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
                        className="rounded-sm border-gray-300 text-[#032c28] focus:ring-[#032c28]"
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
                  className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#032c28] file:text-white hover:file:bg-[#043e39] transition-all cursor-pointer"
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
                  className="px-6 py-3 bg-[#032c28] rounded-sm text-sm font-bold text-white uppercase tracking-wider hover:bg-[#043e39] transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
