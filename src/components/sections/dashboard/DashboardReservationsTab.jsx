import { motion } from "framer-motion";

export default function DashboardReservationsTab({ reservations, router }) {
  return (
    <motion.div 
      key="reservations"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-12"
    >
      <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
        My Table Reservations
      </h1>

      {reservations.length > 0 ? (
        <div className="space-y-6">
          {reservations.map((res) => (
            <div key={res._id} className="flex flex-col md:flex-row md:items-start justify-between border border-gray-100 rounded-sm p-4 md:p-6 hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Reservation #{res._id.substring(0,8).toUpperCase()}</span>
                <h3 className="text-xl font-bold text-[#0f284f] uppercase tracking-wide mb-2">Table for {res.guests}</h3>
                <p className="text-gray-500 text-sm mb-1"><span className="font-semibold text-gray-700">Date:</span> {new Date(res.date).toLocaleDateString()}</p>
                <p className="text-gray-500 text-sm mb-1"><span className="font-semibold text-gray-700">Time:</span> {res.time}</p>
                {res.specialRequests && <p className="text-gray-500 text-sm mt-2 italic">&quot;{res.specialRequests}&quot;</p>}
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                 <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm mb-4 ${
                      res.status === 'confirmed' ? 'bg-[#eef2f6] text-[#0f284f]' :
                      res.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {res.status}
                 </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You have no table reservations.</p>
          <button onClick={() => router.push("/restaurant")} className="bg-[#ffbca8] px-6 py-3 text-sm font-semibold tracking-wide text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm uppercase">
            Reserve a Table
          </button>
        </div>
      )}
    </motion.div>
  );
}
