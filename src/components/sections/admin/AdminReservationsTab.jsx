export default function AdminReservationsTab({ reservations, updateReservationStatus }) {
  return (
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
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Guest Info</p>
              <p className="text-sm font-bold text-slate-900">{res.user?.name || res.name || 'Unknown'}</p>
              <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1.5">
                <span className="text-slate-400">✉️</span> {res.user?.email || res.email || 'N/A'}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1.5">
                <span className="text-slate-400">📞</span> {res.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Reservation Details</p>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1.5 text-sm">
                <p className="flex justify-between"><span className="text-slate-500">Date:</span> <span className="font-semibold text-slate-800">{new Date(res.date).toLocaleDateString()}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Time:</span> <span className="font-semibold text-slate-800">{res.time}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Guests:</span> <span className="font-semibold text-slate-800">{res.guests}</span></p>
              </div>
            </div>
            {res.specialRequests && (
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Special Requests</p>
                <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                  {res.specialRequests}
                </p>
              </div>
            )}
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
  );
}
