"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [isRoomsHovered, setIsRoomsHovered] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roomTypes = [
    "SINGLE",
    "DOUBLE",
    "DELUXE",
    "SUITE",
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
            <button className={`flex items-center space-x-1 transition-colors py-2 ${pathname.startsWith("/rooms") ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
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

          <Link href="/restaurant" className={`transition-colors ${pathname === "/restaurant" ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
            RESTAURANT
          </Link>
          <Link href="/about" className={`transition-colors ${pathname === "/about" ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
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
          <Link href="/contact" className={`transition-colors ${pathname === "/contact" ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
            CONTACT US
          </Link>
          {mounted ? (
            user ? (
              <Link href="/dashboard" className={`transition-colors ${pathname === "/dashboard" ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
                DASHBOARD
              </Link>
            ) : (
              <Link href="/login" className={`transition-colors ${pathname === "/login" ? "text-[#ffbca8]" : "hover:text-[#ffbca8]"}`}>
                LOGIN
              </Link>
            )
          ) : (
            <div className="w-[45px]"></div>
          )}
          <Link
            href="/rooms"
            className="bg-[#ffbca8] px-6 py-3 text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
}
