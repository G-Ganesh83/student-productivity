import axios from "axios";

import { clearStoredAuth, getStoredToken, isTokenExpired } from "../utils/auth";

let authToken = null;
let authFailureHandler = null;

export const setApiAuthToken = (token) => {
  authToken = token || null;
};

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = handler || null;
};

const handleAuthFailure = () => {
  authToken = null;
  clearStoredAuth();
  authFailureHandler?.();
};

const getAuthToken = () => authToken || getStoredToken();

export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      if (isTokenExpired(token)) {
        handleAuthFailure();
        return Promise.reject(new Error("Session expired. Please sign in again."));
      }

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error:", error.response || error.message);

    const status = error?.response?.status;
    const message = error?.response?.data?.message?.toLowerCase?.() || "";

    if (
      status === 401 ||
      message.includes("token expired") ||
      message.includes("invalid token") ||
      message.includes("no token provided")
    ) {
      handleAuthFailure();
    }

    return Promise.reject(error);
  }
);

export default api;
