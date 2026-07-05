"use client";

import HomeHeroSection from "@/components/sections/home/HomeHeroSection";
import dynamic from "next/dynamic";

const HomeAmenitiesSection = dynamic(() => import("@/components/sections/home/HomeAmenitiesSection"));
const HomeTestimonialsSection = dynamic(() => import("@/components/sections/home/HomeTestimonialsSection"));
const HomeBookingSection = dynamic(() => import("@/components/sections/home/HomeBookingSection"));

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HomeHeroSection />
      <HomeAmenitiesSection />
      <HomeTestimonialsSection />
      <HomeBookingSection />
    </main>
  );
}
