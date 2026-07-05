"use client";

import AboutIntroSection from "@/components/sections/about/AboutIntroSection";
import AboutRoomsPromoSection from "@/components/sections/about/AboutRoomsPromoSection";
import AboutLocationSection from "@/components/sections/about/AboutLocationSection";

export default function AboutPage() {
  return (
    <main className="w-full bg-white overflow-hidden">
      <AboutIntroSection />
      <AboutRoomsPromoSection />
      <AboutLocationSection />
    </main>
  );
}
