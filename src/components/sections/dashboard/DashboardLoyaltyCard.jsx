import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export default function DashboardLoyaltyCard({
  displayTier,
  userPoints,
  loyalty,
}) {
  return (
    <div className="bg-[#0f284f] text-white rounded-sm shadow-lg border border-gray-100 p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Crown className="w-48 h-48" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#ffbca8]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-[#ffbca8] whitespace-nowrap">
              {displayTier} Member
            </h2>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide mb-4 sm:mb-6">
            Elite Guest Loyalty Program
          </p>
          <p className="text-3xl sm:text-4xl font-black mb-1">
            {userPoints.toLocaleString()}{" "}
            <span className="text-sm sm:text-lg font-medium text-gray-300">
              PTS
            </span>
          </p>
        </div>

        {displayTier !== "Platinum" && (
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2 text-gray-300">
              <span>{displayTier}</span>
              <span>{loyalty.nextTier}</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loyalty.progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-[#ffbca8]"
              />
            </div>
            <p className="text-sm text-right font-medium text-gray-300">
              Earn{" "}
              <span className="text-[#ffbca8] font-bold">
                {loyalty.pointsNeeded}
              </span>{" "}
              more points for {loyalty.nextTier}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
