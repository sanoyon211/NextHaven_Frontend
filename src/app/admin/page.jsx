"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, DollarSign, BedDouble, CalendarCheck } from "lucide-react";

const INITIAL_ROOMS = [
  { id: 1, title: "Standard Room", type: "Standard", price: "$59", status: "Available", image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=500" },
  { id: 2, title: "Superior Room", type: "Superior", price: "$79", status: "Maintenance", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=500" },
  { id: 3, title: "Deluxe Room", type: "Deluxe", price: "$129", status: "Available", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500" },
  { id: 4, title: "Executive Suite", type: "Suite", price: "$199", status: "Available", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=500" },
];

export default function AdminDashboard() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

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

  const handleAddNewRoom = () => {
    toast.success("Room creation form will open here", {
      style: {
        background: '#0f284f',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#0f284f',
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-[#0f284f] uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <button 
            onClick={handleAddNewRoom}
            className="flex items-center space-x-2 bg-[#0f284f] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#1a3d72] transition-colors"
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
              <p className="text-3xl font-black text-[#0f284f]">$15,200</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-full">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Bookings</p>
              <p className="text-3xl font-black text-[#0f284f]">12</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-4 bg-purple-100 text-purple-700 rounded-full">
              <BedDouble className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Rooms Available</p>
              <p className="text-3xl font-black text-[#0f284f]">8</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Room Management Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-[#0f284f] text-xl font-bold uppercase tracking-wider">
              Room Management
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#0f284f] border-b border-gray-200 uppercase text-xs tracking-wider">
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
                        className="p-2 text-gray-500 hover:text-[#0f284f] hover:bg-blue-50 rounded-full transition-colors"
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
    </main>
  );
}
