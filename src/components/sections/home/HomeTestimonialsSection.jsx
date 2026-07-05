import Image from "next/image";
import { Quote } from "lucide-react";

export default function HomeTestimonialsSection() {
  return (
    <section className="py-20 bg-[#0f284f] w-full overflow-hidden relative">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0f284f] to-transparent z-10 hidden md:block"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0f284f] to-transparent z-10 hidden md:block"></div>
      
      <div className="text-center mb-16 relative z-20">
        <h2 className="font-heading text-white text-3xl md:text-5xl font-bold mb-4">Guest Experiences</h2>
        <p className="text-gray-300 font-sans">What our esteemed guests say about NextHaven.</p>
      </div>

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[1, 2, 3, 4, 1, 2, 3, 4].map((num, idx) => (
          <div key={idx} className="w-[85vw] sm:w-[400px] md:w-[450px] px-4 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 flex flex-col h-full rounded-sm">
              <Quote className="w-8 h-8 text-[#d4af37] mb-4 opacity-50" />
              <p className="font-sans text-gray-200 italic mb-6 flex-1">
                &quot;Absolutely breathtaking! The attention to detail, the luxurious rooms, and the impeccable service made our anniversary unforgettable.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
                  <Image src={`https://i.pravatar.cc/150?img=${num * 10}`} width={40} height={40} alt="Guest" />
                </div>
                <div>
                  <h4 className="font-heading text-white font-bold text-sm">Eleanor Williams</h4>
                  <p className="font-sans text-[#d4af37] text-xs">New York, USA</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
