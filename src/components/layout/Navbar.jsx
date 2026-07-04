"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isRoomsHovered, setIsRoomsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const roomTypes = [
    { name: "STANDARD ROOM", slug: "single" },
    { name: "SUPERIOR ROOM", slug: "double" },
    { name: "DELUXE ROOM", slug: "deluxe" },
    { name: "EXECUTIVE SUITE", slug: "suite" },
  ];

  const isHomePage = pathname === "/";
  const headerClasses = isHomePage
    ? `fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white shadow-sm py-0" : "bg-transparent py-2"} text-gray-900`
    : `sticky top-0 z-50 w-full transition-all duration-300 bg-white shadow-sm text-gray-900`;

  return (
    <header className={headerClasses}>
      <div className={`mx-auto flex transition-all duration-300 ${isScrolled ? "h-14" : "h-20"} max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8`}>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 items-center space-x-8 text-sm font-semibold tracking-wide">
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
                      key={room.name}
                      href={`/rooms/${room.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#ffbca8] transition-colors"
                    >
                      {room.name}
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
        <div className="flex shrink-0 items-center justify-center flex-1 md:flex-none">
          <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-widest text-gray-900 whitespace-nowrap">
            HOTEL SUITES
          </Link>
        </div>

        {/* Right Side: Contact & Button (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-8 text-sm font-semibold tracking-wide">
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

        {/* Mobile Right Spacer for centering logo */}
        <div className="flex md:hidden flex-1 justify-end"></div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden absolute w-full left-0 top-full shadow-lg"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4 text-sm font-semibold tracking-wide">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/rooms" className={`block py-2 ${pathname.startsWith("/rooms") ? "text-[#ffbca8]" : "text-gray-900"}`}>
                OUR ROOMS
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/restaurant" className={`block py-2 ${pathname === "/restaurant" ? "text-[#ffbca8]" : "text-gray-900"}`}>
                RESTAURANT
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className={`block py-2 ${pathname === "/about" ? "text-[#ffbca8]" : "text-gray-900"}`}>
                ABOUT US
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className={`block py-2 ${pathname === "/contact" ? "text-[#ffbca8]" : "text-gray-900"}`}>
                CONTACT US
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                {mounted && (
                  user ? (
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="block py-2 text-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                      DASHBOARD
                    </Link>
                  ) : (
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="block py-2 text-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                      LOGIN
                    </Link>
                  )
                )}
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  href="/rooms"
                  className="block w-full bg-[#ffbca8] px-6 py-3 text-center text-gray-900 transition-colors hover:bg-[#ffbca8]/80 rounded-sm"
                >
                  BOOK NOW
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
