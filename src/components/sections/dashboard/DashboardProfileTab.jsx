import { motion } from "framer-motion";

export default function DashboardProfileTab({ profileName, setProfileName, setProfileImage, handleProfileUpdate, isUpdatingProfile }) {
  return (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-12"
    >
      <h1 className="text-3xl font-bold text-[#0f284f] uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
        My Profile
      </h1>
      
      <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
          <input
            type="text"
            required
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:border-[#0f284f] focus:ring-1 focus:ring-[#0f284f] transition-all"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#0f284f] file:text-white hover:file:bg-[#1a3d72] transition-all cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="w-full sm:w-auto bg-[#0f284f] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-sm hover:bg-[#1a3d72] transition-colors disabled:opacity-70"
        >
          {isUpdatingProfile ? "UPDATING..." : "SAVE CHANGES"}
        </button>
      </form>
    </motion.div>
  );
}
