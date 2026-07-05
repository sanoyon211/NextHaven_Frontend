import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RestaurantSignatureMenuSection({
  signatureMenu,
  loading,
  addToCart,
  handleOrderNow,
}) {
  return (
    <section
      id="signature-menu"
      className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-8 md:mb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-[#0f284f] text-2xl md:text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
            Our Signature Menu
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A curated selection of our most exquisite dishes, prepared with the
            finest seasonal ingredients.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 md:mb-16">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="relative h-48 md:h-64 w-full bg-slate-200/60">
                  <div className="absolute top-4 left-4 bg-white/80 h-6 w-16 rounded-sm"></div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="h-6 md:h-7 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-7 md:h-8 bg-slate-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-slate-200/80 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200/80 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          signatureMenu.slice(0, 4).map((item, idx) => (
            <Dialog key={item._id}>
              <DialogTrigger
                nativeButton={false}
                render={
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden group transition-all flex flex-col text-left cursor-pointer h-full"
                  />
                }
              >
                <div className="relative h-48 md:h-64 w-full overflow-hidden shrink-0">
                  <Image
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"
                    }
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
                    <span className="text-xs font-bold text-[#0f284f] uppercase tracking-wider">
                      {item.category || "Signature"}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="text-[#0f284f] text-base md:text-xl font-bold uppercase tracking-wide pr-2 md:pr-4">
                      {item.name}
                    </h3>
                    <p className="text-xl md:text-2xl font-black text-[#0f284f]">
                      ${item.price}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                    {item.description || item.ingredients}
                  </p>
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                    <Image
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"
                      }
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <DialogHeader className="text-left mb-6">
                      <span className="text-xs font-bold text-[#ffbca8] uppercase tracking-wider mb-2 block">
                        {item.category || "Signature"}
                      </span>
                      <DialogTitle className="text-[#0f284f] text-3xl font-extrabold uppercase tracking-wide">
                        {item.name}
                      </DialogTitle>
                    </DialogHeader>

                    <p className="text-2xl font-black text-[#0f284f] mb-6 border-b border-gray-100 pb-6">
                      ${item.price}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                          Details
                        </h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                          Ingredients
                        </h4>
                        <p className="text-gray-500 text-sm leading-relaxed italic">
                          {item.ingredients}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-white border-2 border-[#0f284f] text-[#0f284f] font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-slate-50 transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleOrderNow(item)}
                        className="flex-1 bg-[#0f284f] border-2 border-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center"
      >
        <Link href="/restaurant/all-menu">
          <button className="bg-[#0f284f] text-white font-extrabold uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-[#1a3d72] transition-colors">
            View Full Menu
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
