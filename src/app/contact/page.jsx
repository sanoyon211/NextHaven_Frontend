"use client";

import ContactHeroSection from "@/components/sections/contact/ContactHeroSection";
import ContactInfoFormSection from "@/components/sections/contact/ContactInfoFormSection";

export default function ContactPage() {
  return (
    <main className="bg-white w-full overflow-hidden">
      <ContactHeroSection />
      <ContactInfoFormSection />
    </main>
  );
}
