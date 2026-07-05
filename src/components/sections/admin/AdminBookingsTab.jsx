export default function AdminBookingsTab({ bookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
      {bookings.length === 0 && (
        <div className="col-span-full p-8 text-center text-slate-500">
          No bookings found.
        </div>
      )}
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <span className="font-mono text-sm font-bold text-[#0f284f]">
              #{booking._id.substring(0, 8).toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${booking.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
            >
              {booking.paymentStatus}
            </span>
          </div>
          <div className="flex-1 space-y-3 mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                Guest Name
              </p>
              <p className="text-sm font-bold text-slate-900">
                {booking.user?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                Room Info
              </p>
              <p
                className="text-sm font-semibold text-slate-800 truncate"
                title={booking.room?.title}
              >
                {booking.room ? (
                  <>
                    {booking.room.roomNumber
                      ? `Room ${booking.room.roomNumber}`
                      : "Room"}{" "}
                    •{" "}
                    <span className="text-slate-600 font-normal">
                      {booking.room.title || "Unknown Room"}
                    </span>
                  </>
                ) : (
                  <span className="text-rose-500 italic">Room Deleted</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                Duration
              </p>
              <p className="text-sm font-medium text-slate-700">
                {new Date(booking.checkInDate).toLocaleDateString()}{" "}
                <span className="text-slate-400 mx-1">→</span>{" "}
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <span className="text-lg font-black text-[#0f284f]">
              ${booking.totalAmount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
