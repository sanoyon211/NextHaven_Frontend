import { motion } from "framer-motion";
import Image from "next/image";
import { FileText, XCircle } from "lucide-react";

export default function DashboardBookingsTab({ bookings, generatePDF, handleCancelBooking, router }) {
  return (
    <motion.div 
      key="bookings"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-12"
    >
      <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
        Personal Booking History
      </h1>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="flex flex-col md:flex-row items-center border border-gray-100 rounded-sm p-4 hover:shadow-md transition-shadow group">
              <div className="relative w-full md:w-48 h-32 rounded-sm overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <Image 
                  src={booking.room?.image || booking.room?.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80"} 
                  alt={booking.room?.title || "Room"} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 200px" 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Booking #{booking._id.substring(0,8).toUpperCase()}</span>
                    <h3 className="text-xl font-bold text-[#0f284f] uppercase tracking-wide mb-2">{booking.room?.roomNumber ? `Room ${booking.room.roomNumber} - ${booking.room.title}` : (booking.room?.title || "Room")}</h3>
                    <p className="text-gray-500 text-sm mb-1"><span className="font-semibold text-gray-700">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                    <p className="text-gray-500 text-sm mb-4 md:mb-0"><span className="font-semibold text-gray-700">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm mb-4 ${
                      booking.paymentStatus === 'paid' ? 'bg-[#eef2f6] text-[#0f284f]' :
                      booking.paymentStatus === 'refunded' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                    <p className="text-2xl font-black text-[#0f284f] mb-4">${booking.totalAmount}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                      {booking.paymentStatus === 'paid' && (
                        <button 
                          onClick={() => generatePDF(booking)}
                          className="flex items-center space-x-2 text-sm font-bold text-[#0f284f] bg-[#eef2f6] hover:bg-[#e2e8f0] px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Invoice</span>
                        </button>
                      )}
                      {booking.paymentStatus === 'paid' && new Date(booking.checkInDate) > new Date() && (
                        <button 
                          onClick={() => handleCancelBooking(booking)}
                          className="flex items-center space-x-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You have no booking history yet.</p>
          <button onClick={() => router.push("/rooms")} className="bg-[#ffbca8] px-6 py-3 text-sm font-semibold tracking-wide text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm uppercase">
            Book a Room
          </button>
        </div>
      )}
    </motion.div>
  );
}
