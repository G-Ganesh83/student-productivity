/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { setApiAuthToken, setAuthFailureHandler } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  getTokenExpiryDelay,
  isTokenExpired,
  storeAuth,
} from "../utils/auth";

const AuthContext = createContext(null);

const getInitialAuthState = () => {
  const token = getStoredToken();

  if (!token) {
    clearStoredAuth();
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }

  return {
    token,
    user: getStoredUser(),
    isAuthenticated: true,
  };
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);
  const { token, user, isAuthenticated } = authState;

  const logout = useCallback(() => {
    clearStoredAuth();
    disconnectSocket();
    setApiAuthToken(null);
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  }, []);

  const login = useCallback(
    (nextToken, nextUser) => {
      if (!nextToken || isTokenExpired(nextToken)) {
        window.setTimeout(() => {
          logout();
        }, 0);
        return;
      }

      storeAuth(nextToken, nextUser);
      setAuthState({
        token: nextToken,
        user: nextUser || null,
        isAuthenticated: true,
      });
    },
    [logout]
  );

  useEffect(() => {
    setApiAuthToken(token);

    if (!token) {
      disconnectSocket();
      return;
    }

    connectSocket(token);
  }, [logout, token]);

  useEffect(() => {
    setAuthFailureHandler(logout);

    return () => {
      setAuthFailureHandler(null);
    };
  }, [logout]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const expiryDelay = getTokenExpiryDelay(token);

    if (expiryDelay <= 0) {
      const timeoutId = window.setTimeout(() => {
        logout();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, expiryDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [logout, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout, token, user]
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
