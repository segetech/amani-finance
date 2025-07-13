import React, { createContext, useContext, useState, useEffect } from "react";
import { demoAccounts, DemoUser } from "../lib/demoAccounts";

interface AuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    // Check if user was previously logged in
    const savedUser = localStorage.getItem("amani-demo-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = demoAccounts.find(
      (account) => account.email === email && account.password === password,
    );

    if (foundUser) {
      // Update last login time
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toLocaleString("fr-FR"),
      };
      setUser(updatedUser);
      localStorage.setItem("amani-demo-user", JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("amani-demo-user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
