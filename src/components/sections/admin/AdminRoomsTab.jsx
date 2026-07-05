import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

export default function AdminRoomsTab({ rooms, openEditRoomModal, handleDeleteRoom, toggleStatus }) {
  return (
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
  );
}
