export default function AdminFoodOrdersTab({ foodOrders, updateFoodOrderStatus }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
      {foodOrders.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No food orders found.</div>}
      {foodOrders.map((order) => (
        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <span className="font-mono text-sm font-bold text-[#0f284f]">#{order._id.substring(0, 8).toUpperCase()}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : order.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {order.orderStatus}
            </span>
          </div>
          <div className="flex-1 space-y-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Customer & Location</p>
              <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Unknown'}</p>
              <p className="text-xs font-medium text-slate-600 mt-1 flex items-start gap-1">
                <span className="text-slate-400">📍</span> {order.deliveryLocation || 'N/A'}
              </p>
              {order.orderNotes && <p className="text-xs text-slate-500 mt-1.5 italic bg-slate-50 p-2 rounded-lg border border-slate-100">📝 {order.orderNotes}</p>}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Ordered Items</p>
              <div className="flex flex-wrap gap-1.5">
                {order.items.map(i => (
                  <span key={i._id || i.name} className="inline-block bg-white text-slate-700 px-2 py-1 rounded text-xs font-medium border border-slate-200 shadow-sm">
                    {i.quantity}x {i.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 mt-auto">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-[#0f284f]">${order.totalAmount}</span>
            </div>
            <select
              value={order.orderStatus}
              onChange={(e) => updateFoodOrderStatus(order._id, e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-[#0f284f] focus:bg-white focus:ring-2 focus:ring-[#0f284f]/10 cursor-pointer transition-all"
            >
              <option value="preparing">👨‍🍳 Preparing</option>
              <option value="ready">🛎️ Ready</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
