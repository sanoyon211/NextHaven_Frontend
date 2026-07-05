"use client";

import { Suspense, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

// Initialize Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is required, though we might not redirect if we handle it here,
        // but Stripe requires it for redirect-based payment methods (e.g. 3D secure).
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Manually verify payment to bypass webhook requirement for local development
      try {
        await api.post("/bookings/verify-payment", {
          paymentIntentId: paymentIntent.id,
        });
        toast.success("Payment successful!");
        window.location.href = "/checkout/success";
      } catch (err) {
        toast.error("Failed to verify payment status.");
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-6">
        <PaymentElement />
      </div>

      <button
        disabled={isProcessing || !stripe || !elements}
        type="submit"
        className="w-full bg-[#0f284f] text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-[#1a3d72] focus:outline-none focus:ring-2 focus:ring-[#0f284f] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${amount || "0.00"} Now`}
      </button>

      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <Lock className="w-4 h-4 mr-2" />
        Secured encrypted processing by Stripe
      </div>
    </form>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const amount = searchParams.get("amount");

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Initializing secure payment...
        </p>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0f284f", // navy
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Custom Card UI */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 bg-[#d4af37] text-[#0f284f] text-xs font-bold px-4 py-2 rounded-bl-lg uppercase tracking-wider">
            Secure Checkout
          </div>

          <div className="p-8 pb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-4">
              Complete Payment
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Pay once, enjoy your stay. No hidden fees.
            </p>

            <div className="mt-6 flex items-baseline">
              <span className="text-5xl font-black text-gray-900">
                ${amount || "0"}
              </span>
              <span className="ml-2 text-sm font-bold text-gray-500 tracking-wide">
                / TOTAL
              </span>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance }}
              >
                <CheckoutForm amount={amount} />
              </Elements>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-center text-xs font-bold text-gray-400 tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Guaranteed Safe & Secure Checkout
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
