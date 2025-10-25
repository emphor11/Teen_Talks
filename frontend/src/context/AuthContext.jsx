// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("user");
      if (s && s !== "undefined") {
        const parsed = JSON.parse(s);
        setUser(parsed);
        console.log("Loaded user from storage:", parsed);
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (userObj, token) => {
    if (!userObj || !token) {
      console.warn("login called without user or token");
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, api: API }}>
      {children}
    </AuthContext.Provider>
  );
};
