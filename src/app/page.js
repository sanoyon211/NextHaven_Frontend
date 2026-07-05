"use client";

import HomeHeroSection from "@/components/sections/home/HomeHeroSection";
import HomeAmenitiesSection from "@/components/sections/home/HomeAmenitiesSection";
import HomeTestimonialsSection from "@/components/sections/home/HomeTestimonialsSection";
import HomeBookingSection from "@/components/sections/home/HomeBookingSection";

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
