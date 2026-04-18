/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setApiAuthToken } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    setApiAuthToken(token);

    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
    setToken(nextToken);
    setUser(nextUser || null);
    setIsAuthenticated(true);
    connectSocket(nextToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
