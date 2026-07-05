"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am your NextHaven Concierge. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: userMessage.text });
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm sorry, I encountered an error connecting to my servers. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-3 md:p-4 bg-[#0f284f] text-white rounded-full shadow-2xl hover:bg-[#1a3d72] transition-transform hover:scale-105 z-[100] flex items-center justify-center"
      >
        <MessageCircle className="w-5 h-5 md:w-7 md:h-7" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 w-full h-full md:w-[350px] md:h-[500px] max-h-[80vh] bg-white md:rounded-lg shadow-2xl z-[60] md:border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#0f284f] text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase">
                  NextHaven Concierge
                </h3>
                <p className="text-xs text-gray-300">AI-Powered Assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 min-h-0 overflow-y-auto bg-gray-50 flex flex-col space-y-4"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#ffbca8] text-gray-900 self-end rounded-tr-none font-medium"
                      : "bg-white text-gray-700 self-start rounded-tl-none border border-gray-100 leading-relaxed"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="bg-white text-gray-500 self-start rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-100 text-sm flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about our rooms..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#0f284f]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2 bg-[#0f284f] text-white rounded-full hover:bg-[#1a3d72] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
