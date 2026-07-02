"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isRoomsHovered, setIsRoomsHovered] = useState(false);

  const roomTypes = [
    "STANDARD",
    "SUPERIOR",
    "DELUXE",
    "EXECUTIVE",
    "PENTHOUSE",
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-gray-900 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Navigation Links */}
        <nav className="flex flex-1 items-center space-x-8 text-sm font-semibold tracking-wide">
          <div
            className="relative"
            onMouseEnter={() => setIsRoomsHovered(true)}
            onMouseLeave={() => setIsRoomsHovered(false)}
          >
            <button className="flex items-center space-x-1 hover:text-[#ffbca8] transition-colors py-2">
              <span>OUR ROOMS</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  isRoomsHovered ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isRoomsHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5"
                >
                  {roomTypes.map((room) => (
                    <Link
                      key={room}
                      href={`/rooms/${room.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffbca8] transition-colors"
                    >
                      {room}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/restaurant" className="hover:text-[#ffbca8] transition-colors">
            RESTAURANT
          </Link>
          <Link href="/about" className="hover:text-[#ffbca8] transition-colors">
            ABOUT US
          </Link>
        </nav>

        {/* Center: Text Logo */}
        <div className="flex shrink-0 items-center justify-center">
          <Link href="/" className="text-3xl font-extrabold tracking-widest text-gray-900">
            HOTEL SUITES
          </Link>
        </div>

        {/* Right Side: Contact & Button */}
        <div className="flex flex-1 items-center justify-end space-x-8 text-sm font-semibold tracking-wide">
          <Link href="/contact" className="hover:text-[#ffbca8] transition-colors">
            CONTACT US
          </Link>
          <Link
            href="/book"
            className="bg-[#ffbca8] px-6 py-3 text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
}
