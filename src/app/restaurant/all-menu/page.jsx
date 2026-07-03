"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Dummy data covering Appetizers, Main Courses, and Desserts
const MENU_ITEMS = [
  {
    id: 1,
    name: "Truffle Beef Tartare",
    category: "Appetizers",
    price: "$32",
    description: "Finely chopped, highest-grade wagyu beef mixed with capers, shallots, and a touch of Dijon, topped with a quail egg and shaved black truffle.",
    ingredients: "Wagyu Beef, Capers, Quail Egg, Black Truffle, Dijon Mustard, Toasted Brioche",
    imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c4?q=80&w=1500"
  },
  {
    id: 2,
    name: "Pan-Seared Scallops",
    category: "Appetizers",
    price: "$28",
    description: "Jumbo scallops seared to a golden crisp, served over a silky cauliflower purée and finished with crispy pancetta and crispy sage.",
    ingredients: "Jumbo Scallops, Cauliflower, Pancetta, Sage, Brown Butter",
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1500"
  },
  {
    id: 3,
    name: "Wagyu Ribeye Steak",
    category: "Main Courses",
    price: "$85",
    description: "A perfectly marbled 12oz Wagyu ribeye, cooked to your preference and served with potato gratin, wild mushrooms, and a rich bordelaise sauce.",
    ingredients: "Wagyu Ribeye, Potato Gratin, Wild Mushrooms, Red Wine Bordelaise",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1500"
  },
  {
    id: 4,
    name: "Miso Glazed Black Cod",
    category: "Main Courses",
    price: "$54",
    description: "Sustainably caught black cod marinated in sweet saikyo miso, broiled to perfection, and served in a fragrant ginger dashi broth.",
    ingredients: "Black Cod, Saikyo Miso, Baby Bok Choy, Ginger, Dashi, Sesame",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1500"
  },
  {
    id: 5,
    name: "Wild Mushroom Risotto",
    category: "Main Courses",
    price: "$42",
    description: "Creamy Arborio rice slowly cooked with a medley of wild foraged mushrooms, finished with aged parmesan and white truffle oil.",
    ingredients: "Arborio Rice, Porcini Mushrooms, Parmesan Reggiano, White Truffle Oil, Garlic",
    imageUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=1500"
  },
  {
    id: 6,
    name: "Valrhona Chocolate Soufflé",
    category: "Desserts",
    price: "$22",
    description: "A decadent, airy soufflé made with 70% dark Valrhona chocolate, served warm with Madagascar vanilla bean ice cream.",
    ingredients: "Dark Chocolate, Eggs, Sugar, Madagascar Vanilla, Cream",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c8e9e1cb?q=80&w=1500"
  },
  {
    id: 7,
    name: "Lemon Tart",
    category: "Desserts",
    price: "$18",
    description: "A buttery shortbread crust filled with zesty lemon curd, topped with beautifully torched Italian meringue and a side of raspberry coulis.",
    ingredients: "Lemons, Sugar, Butter, Eggs, Flour, Raspberries",
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1500"
  },
  {
    id: 8,
    name: "Artisan Cheese Board",
    category: "Appetizers",
    price: "$36",
    description: "A chef-selected assortment of fine international cheeses, served with honeycomb, fresh figs, candied walnuts, and house-made crackers.",
    ingredients: "Assorted Cheeses, Honeycomb, Figs, Walnuts, Artisanal Crackers",
    imageUrl: "https://images.unsplash.com/photo-1631379577930-947211bfdbf7?q=80&w=1500"
  }
];

// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AllMenuPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-[#f8fafc] w-full min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header & Search */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[#0f284f] text-4xl md:text-5xl font-bold uppercase tracking-widest mb-6 drop-shadow-sm">
              Our Exquisite Menu
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore our full selection of culinary masterpieces. Use the search bar below to find your favorite dish.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white border-gray-200 shadow-sm rounded-full text-base focus-visible:ring-[#0f284f]"
              />
            </div>
          </motion.div>
        </div>

        {/* Menu Grid */}
        {filteredMenu.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredMenu.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
                        <span className="text-xs font-bold text-[#0f284f] uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#0f284f] text-xl font-bold uppercase tracking-wide pr-4">
                          {item.name}
                        </h3>
                        <p className="text-2xl font-black text-[#0f284f]">{item.price}</p>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                      <DialogHeader className="text-left mb-6">
                        <span className="text-xs font-bold text-[#ffbca8] uppercase tracking-wider mb-2 block">
                          {item.category}
                        </span>
                        <DialogTitle className="text-[#0f284f] text-3xl font-extrabold uppercase tracking-wide">
                          {item.name}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <p className="text-2xl font-black text-[#0f284f] mb-6 border-b border-gray-100 pb-6">
                        {item.price}
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Details</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Ingredients</h4>
                          <p className="text-gray-500 text-sm leading-relaxed italic">{item.ingredients}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert(`Added ${item.name} to your room order!`)}
                        className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-[#1a3d72] transition-colors"
                      >
                        Order To Room
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No menu items found matching "{searchQuery}".</p>
          </div>
        )}

      </div>
    </main>
  );
}
