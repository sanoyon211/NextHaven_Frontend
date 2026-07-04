"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed");
    }
    setUser(null);
    // You could also sign out of Firebase here if needed
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
