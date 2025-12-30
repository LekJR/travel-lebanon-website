import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ save
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ remove
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
