import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function RoomGrid({ rooms, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 animate-pulse">
            <div className="h-48 md:h-60 bg-gray-200"></div>
            <div className="p-4 md:p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex justify-between items-end mt-4 md:mt-6">
                <div className="space-y-2 w-1/2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="text-right">
                  <div className="h-3 bg-gray-200 rounded w-12 ml-auto mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
        <h3 className="text-xl font-bold text-[#0f284f] mb-2 uppercase">No Rooms Found</h3>
        <p className="text-gray-500">Try adjusting your filters to find available rooms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room, idx) => (
        <motion.div
          key={room._id || room.id || idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: (idx % 6) * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white shadow-sm hover:shadow-xl rounded-lg overflow-hidden group cursor-pointer border border-gray-100 transition-all"
        >
          <Link href={`/rooms/${room._id || room.id}`}>
            <div className="h-48 md:h-60 overflow-hidden relative bg-gray-100">
              <Image
                src={room.image || room.images?.[0] || "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2000"}
                alt={room.title || "Room"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-[#0f284f] font-extrabold uppercase text-base md:text-lg mb-1 md:mb-2">
                {room.roomNumber ? `Room ${room.roomNumber} - ${room.title}` : room.title}
              </h3>
              <div className="flex justify-between items-end mt-4 md:mt-6">
                <p className="text-gray-500 text-xs w-1/2 leading-relaxed font-medium">
                  {room.description || room.details || `${room.capacity || 2} adults`}
                </p>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    From
                  </p>
                  <p className="text-xl md:text-2xl font-black text-[#0f284f]">
                    ${room.pricePerNight}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
