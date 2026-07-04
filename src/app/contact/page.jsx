"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

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
      staggerChildren: 0.15,
    },
  },
};

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the form data to the server here
    toast.success('Your message has been sent successfully!');
    e.target.reset(); // Reset the form fields
  };

  return (
    <main className="bg-white w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000"
          alt="Luxury Hotel Reception"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle Dark Overlay */}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-white text-5xl md:text-6xl font-bold uppercase tracking-widest drop-shadow-md">
            Get In Touch
          </h1>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-lg"
          >
            {/* Left Column: Contact Info */}
            <motion.div variants={fadeUp} className="flex flex-col space-y-10">
              <div>
                <h2 className="text-[#032c28] text-3xl font-bold uppercase tracking-wider mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  We are here to help you plan your perfect stay. Reach out to our dedicated team for reservations, special requests, or general inquiries.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-[#cb5d49] mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="text-[#032c28] font-bold text-lg mb-1 uppercase tracking-wide">Address</h3>
                    <address className="text-gray-500 not-italic leading-relaxed">
                      The Hoteller,<br />
                      456 Urban Avenue<br />
                      Cityville, NY 10001<br />
                      United States
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-[#cb5d49] mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="text-[#032c28] font-bold text-lg mb-1 uppercase tracking-wide">Phone</h3>
                    <p className="text-gray-500">
                      <a href="tel:+45356343444" className="hover:text-[#032c28] transition-colors">
                        +45 35634 3444
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-[#cb5d49] mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="text-[#032c28] font-bold text-lg mb-1 uppercase tracking-wide">Email</h3>
                    <p className="text-gray-500">
                      <a href="mailto:contact@thehotel.com" className="hover:text-[#032c28] transition-colors">
                        contact@thehotel.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div variants={fadeUp} className="bg-[#f8fafc] p-8 rounded-lg border border-gray-100">
              <h3 className="text-[#032c28] text-2xl font-bold uppercase tracking-wider mb-6">
                Send Us A Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-white border border-gray-200 rounded p-4 text-gray-900 focus:outline-none focus:border-[#032c28] focus:ring-1 focus:ring-[#032c28] transition-colors"
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-white border border-gray-200 rounded p-4 text-gray-900 focus:outline-none focus:border-[#032c28] focus:ring-1 focus:ring-[#032c28] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full bg-white border border-gray-200 rounded p-4 text-gray-900 focus:outline-none focus:border-[#032c28] focus:ring-1 focus:ring-[#032c28] transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full bg-white border border-gray-200 rounded p-4 text-gray-900 focus:outline-none focus:border-[#032c28] focus:ring-1 focus:ring-[#032c28] transition-colors resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#032c28] text-white font-bold uppercase tracking-widest py-4 rounded hover:bg-[#043e39] transition-colors mt-4"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
