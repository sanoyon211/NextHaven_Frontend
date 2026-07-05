import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/AuthContext";
import AIChatbot from "@/components/AIChatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextHaven | Premium Hotel Suites",
  description: "Experience luxury and comfort at NextHaven Hotel Suites. Discover premium accommodations, world-class amenities, and breathtaking views for your perfect getaway.",
  keywords: ["Luxury Hotel", "Premium Suites", "NextHaven", "Vacation", "Boutique Hotel"],
  openGraph: {
    title: "NextHaven | Premium Hotel Suites",
    description: "Experience luxury and comfort at NextHaven Hotel Suites. Discover premium accommodations, world-class amenities, and breathtaking views for your perfect getaway.",
    url: "https://nexthaven.com",
    siteName: "NextHaven",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542314831-c6a4d14b4a1b?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "NextHaven Premium Hotel Exterior",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextHaven | Premium Hotel Suites",
    description: "Experience luxury and comfort at NextHaven Hotel Suites.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <AIChatbot />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
