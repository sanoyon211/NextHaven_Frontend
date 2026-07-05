"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isRoomsHovered, setIsRoomsHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;
  if (pathname && pathname.startsWith("/admin")) return null;

  const roomTypes = [
    { name: "STANDARD ROOM", slug: "single" },
    { name: "SUPERIOR ROOM", slug: "double" },
    { name: "DELUXE ROOM", slug: "deluxe" },
    { name: "EXECUTIVE SUITE", slug: "suite" },
  ];

  const isHomePage = pathname === "/";
  const textColorClass = isHomePage && !isScrolled ? "text-white" : "text-[#0f284f]";
  const headerClasses = isHomePage
    ? `fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white shadow-sm py-0" : "bg-transparent py-2"} ${textColorClass}`
    : `sticky top-0 z-50 w-full transition-all duration-300 bg-white shadow-sm text-[#0f284f]`;

  return (
    <header className={headerClasses}>
      <div className={`mx-auto flex transition-all duration-300 ${isScrolled ? "h-14" : "h-20"} max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8`}>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 -ml-2 rounded-md transition-colors ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-[#0f284f] hover:bg-gray-100'}`}
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
            <button className={`flex items-center space-x-1 transition-colors py-2 ${pathname.startsWith("/rooms") ? "text-[#d4af37]" : "hover:text-[#d4af37]"}`}>
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
                      className="block px-4 py-2 text-sm text-[#0f284f] hover:bg-gray-100 hover:text-[#d4af37] transition-colors"
                    >
                      {room.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/restaurant" className={`transition-colors ${pathname === "/restaurant" ? "text-[#d4af37]" : "hover:text-[#d4af37]"}`}>
            RESTAURANT
          </Link>
          <Link href="/about" className={`transition-colors ${pathname === "/about" ? "text-[#d4af37]" : "hover:text-[#d4af37]"}`}>
            ABOUT US
          </Link>
        </nav>

        {/* Center: Text Logo */}
        <div className="flex shrink-0 items-center justify-center flex-1 md:flex-none">
          <Link href="/" className="font-heading text-2xl md:text-3xl font-extrabold tracking-widest whitespace-nowrap">
            NEXT HAVEN
          </Link>
        </div>

        {/* Right Side: Contact & Button (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-8 text-sm font-semibold tracking-wide">
          <Link href="/contact" className={`transition-colors ${pathname === "/contact" ? "text-[#d4af37]" : "hover:text-[#d4af37]"}`}>
            CONTACT US
          </Link>
          {mounted ? (
            user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <button className="flex items-center focus:outline-none">
                  <div className={`h-10 w-10 rounded-full bg-[#d4af37] overflow-hidden relative flex-shrink-0 border-2 border-transparent transition-colors ${isHomePage && !isScrolled ? 'hover:border-white' : 'hover:border-[#d4af37]'}`}>
                    {user.avatar ? (
                      <Image src={user.avatar} alt="Profile" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#0f284f] text-white text-lg font-bold">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 flex flex-col"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0f284f] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0f284f] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => logout()}
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className={`transition-colors ${pathname === "/login" ? "text-[#d4af37]" : "hover:text-[#d4af37]"}`}>
                LOGIN
              </Link>
            )
          ) : (
            <div className="w-[45px]"></div>
          )}
          <Link
            href="/rooms"
            className="bg-[#d4af37] px-6 py-3 text-[#0f284f] transition-all hover:bg-white hover:text-[#0f284f] rounded-none shadow-md font-bold"
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
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/rooms" className={`block py-2 ${pathname.startsWith("/rooms") ? "text-[#d4af37]" : "text-[#0f284f]"}`}>
                OUR ROOMS
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/restaurant" className={`block py-2 ${pathname === "/restaurant" ? "text-[#d4af37]" : "text-[#0f284f]"}`}>
                RESTAURANT
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className={`block py-2 ${pathname === "/about" ? "text-[#d4af37]" : "text-[#0f284f]"}`}>
                ABOUT US
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className={`block py-2 ${pathname === "/contact" ? "text-[#d4af37]" : "text-[#0f284f]"}`}>
                CONTACT US
              </Link>
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                {mounted && (
                  user ? (
                    <>
                      <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="block py-2 text-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                        DASHBOARD
                      </Link>
                      {user.role === 'admin' && (
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="block py-2 text-center border border-[#0f284f] text-[#0f284f] rounded-sm hover:bg-gray-50 transition-colors font-bold">
                          ADMIN PANEL
                        </Link>
                      )}
                      <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="block w-full py-2 text-center border border-red-200 text-red-600 rounded-sm hover:bg-red-50 transition-colors">
                        LOGOUT
                      </button>
                    </>
                  ) : (
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="block py-2 text-center border border-[#0f284f] rounded-sm hover:bg-gray-50 transition-colors text-[#0f284f]">
                      LOGIN
                    </Link>
                  )
                )}
                <Link
                  onClick={() => setIsMobileMenuOpen(false)}
                  href="/rooms"
                  className="block w-full bg-[#d4af37] px-6 py-3 text-center text-[#0f284f] font-bold transition-colors hover:bg-white border border-[#d4af37] rounded-none shadow-sm"
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
