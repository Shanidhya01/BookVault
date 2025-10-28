import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("lms_user");
    // Prevent JSON.parse(undefined) error
    if (raw === undefined || raw === "undefined" || !raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // validate token by calling profile
    const check = async () => {
      const token = localStorage.getItem("lms_token");
      if (!token) return;
      try {
        const { data } = await api.get("/users/profile");
        setUser(data);
        localStorage.setItem("lms_user", JSON.stringify(data));
      } catch (_) {
        logout();
      }
    };
    check();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("lms_token", token);
    localStorage.setItem("lms_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
