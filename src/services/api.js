import axios from "axios";

let authToken = null;

export const setApiAuthToken = (token) => {
  authToken = token || null;
};

const getAuthToken = () => authToken || localStorage.getItem("token");

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

    return Promise.reject(error);
  }
);

export default api;
