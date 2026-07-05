import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function DashboardFoodOrdersTab({
  foodOrders,
  generateFoodOrderPDF,
  router,
}) {
  return (
    <motion.div
      key="food_orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-12"
    >
      <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
        My Food Orders
      </h1>

      {foodOrders.length > 0 ? (
        <div className="space-y-6">
          {foodOrders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col md:flex-row items-center border border-gray-100 rounded-sm p-4 md:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Order #{order._id.substring(0, 8).toUpperCase()}
                    </span>
                    <p className="text-gray-500 text-sm mb-4">
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded-sm"
                        >
                          <span className="font-semibold text-[#0f284f] text-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm mb-2 ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm mb-4 ${
                        order.paymentStatus === "paid"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    <p className="text-2xl font-black text-[#0f284f] mb-4">
                      ${order.totalAmount.toFixed(2)}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                      {order.paymentStatus === "paid" && (
                        <button
                          onClick={() => generateFoodOrderPDF(order)}
                          className="flex items-center space-x-2 text-sm font-bold text-[#0f284f] bg-[#eef2f6] hover:bg-[#e2e8f0] px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Receipt</span>
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
          <p className="text-gray-500 mb-4">You have no food orders yet.</p>
          <button
            onClick={() => router.push("/restaurant/all-menu")}
            className="bg-[#ffbca8] px-6 py-3 text-sm font-semibold tracking-wide text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm uppercase"
          >
            Order Food
          </button>
        </div>
      )}
    </motion.div>
  );
}
