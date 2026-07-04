"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleAuthSync = async (user) => {
    try {
      const idToken = await user.getIdToken();
      // POST to backend to sync user and receive JWT HTTP-only cookie
      const res = await api.post("/auth/sync", { firebaseToken: idToken });
      setUser(res.data.user || res.data); // Adjust based on your backend response structure
      toast.success("Successfully authenticated!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to sync with backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSync(userCredential.user);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || "Failed to authenticate.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSync(userCredential.user);
    } catch (error) {
      setIsLoading(false);
      toast.error("Google sign-in failed.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { value: resetEmail } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "you@example.com",
      showCancelButton: true,
      confirmButtonColor: "#0f284f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Send Reset Link",
    });

    if (resetEmail) {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        Swal.fire({
          title: "Email Sent!",
          text: "Check your inbox for password reset instructions.",
          icon: "success",
          confirmButtonColor: "#0f284f",
        });
      } catch (error) {
        toast.error(error.message || "Failed to send reset email.");
      }
    }
  };

  return (
    <main className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Image */}
      <div className="relative hidden lg:block w-full h-full min-h-screen">
        <Image
          src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000"
          alt="Luxury Hotel"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 xl:px-24 min-h-screen relative">
        
        {/* Absolute Link back to home (optional but good practice) */}
        <Link 
          href="/" 
          className="absolute top-8 right-8 text-sm font-semibold text-gray-500 hover:text-[#0f284f] uppercase tracking-wider transition-colors"
        >
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-[#0f284f] text-3xl font-bold uppercase tracking-wide mb-3">
              WELCOME TO NEXT HAVEN
            </h1>
            <p className="text-gray-500 text-base">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:border-[#0f284f] focus:ring-1 focus:ring-[#0f284f] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-sm p-4 pr-12 text-sm focus:outline-none focus:border-[#0f284f] focus:ring-1 focus:ring-[#0f284f] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleForgotPassword} 
                className="text-xs font-semibold text-[#0f284f] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f284f] text-white font-bold uppercase tracking-wider py-4 rounded-sm hover:bg-[#1a3d72] transition-colors disabled:opacity-70"
            >
              {isLoading ? "PLEASE WAIT..." : "SIGN IN"}
            </button>
          </form>

          <div className="my-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              or continue with
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 border border-gray-300 bg-white py-4 rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-bold text-gray-600">Sign in with Google</span>
          </button>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#0f284f] hover:underline transition-colors ml-1"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
