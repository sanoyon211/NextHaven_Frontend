import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

export default function AdminMenusTab({ menus, openEditMenuModal, handleDeleteMenu, toggleMenuStatus }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50/30">
      {menus.length === 0 && <div className="col-span-full p-8 text-center text-slate-500">No menu items found.</div>}
      {menus.map((menu) => (
        <div key={menu._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-shadow overflow-hidden group">
          <div className="h-40 overflow-hidden relative bg-gray-100">
            <Image
              src={menu.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80"}
              alt={menu.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => openEditMenuModal(menu)} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDeleteMenu(menu._id)} className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg shadow-sm transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-3 right-3">
              <button
                onClick={() => toggleMenuStatus(menu._id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all border backdrop-blur-sm shadow-sm ${menu.isAvailable
                    ? "bg-emerald-50/95 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-rose-50/95 text-rose-700 border-rose-200 hover:bg-rose-100"
                  }`}
              >
                {menu.isAvailable ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-[#0f284f] font-bold text-base truncate" title={menu.name}>{menu.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                {menu.category}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">{menu.description}</p>
            <div className="pt-3 border-t border-slate-100 mt-auto">
              <p className="text-xl font-black text-[#0f284f]">${menu.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
