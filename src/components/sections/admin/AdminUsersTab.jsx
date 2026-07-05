import Image from "next/image";

export default function AdminUsersTab({ users, handleRoleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
      {users.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No users found.</div>}
      {users.map((u) => (
        <div key={u._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${u.role === 'admin' ? 'bg-purple-500' : 'bg-slate-200 group-hover:bg-[#0f284f]'}`}></div>
          <div className="flex items-start gap-4 mb-4 pl-1">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
              {u.avatar ? (
                <Image src={u.avatar} alt={u.name} width={48} height={48} className="object-cover" />
              ) : (
                <span className="text-[#0f284f] font-bold text-lg">{u.name ? u.name.charAt(0).toUpperCase() : '?'}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-bold text-slate-900 truncate" title={u.name}>{u.name}</h3>
              <p className="text-xs text-slate-500 truncate" title={u.email}>{u.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4 pl-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
              {u.tier || 'Silver'}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span className="text-[#ffbca8]">★</span> {u.points || 0} pts
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-auto pl-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Role Access</label>
            <select
              value={u.role || 'guest'}
              onChange={(e) => handleRoleChange(u._id, e.target.value)}
              className={`w-full text-sm border rounded-lg p-2.5 font-semibold focus:outline-none cursor-pointer transition-all ${
                u.role === 'admin' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-2 focus:ring-purple-500/20' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-2 focus:ring-[#0f284f]/10'
              }`}
            >
              <option value="guest">Guest / Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
