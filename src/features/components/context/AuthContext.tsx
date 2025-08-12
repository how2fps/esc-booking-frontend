"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  phone_number: number;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://18.138.130.229:3000/api/users/me", { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.data) setUser(data.data);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch("http://18.138.130.229:3000/api/users/logout", {
      method: "POST",
      credentials: "include"
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
