import api from "./api";
import { getStoredToken } from "../utils/auth";

const DASHBOARD_CACHE_KEY = "learn-easy-dashboard-cache";
const DASHBOARD_CACHE_TTL = 30 * 1000;

const buildAuthConfig = () => {
  const token = getStoredToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const normalizeTasks = (payload) => (Array.isArray(payload) ? payload : []);
const normalizeRooms = (payload) => (Array.isArray(payload) ? payload : []);

const isBrowser = typeof window !== "undefined";

const buildTaskStats = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
  };
};

const sanitizeDashboardData = (payload = {}) => {
  const tasks = normalizeTasks(payload.tasks);
  const rooms = normalizeRooms(payload.rooms);

  return {
    tasks,
    rooms,
    stats: buildTaskStats(tasks),
  };
};

export const getCachedDashboardData = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const rawCache = window.sessionStorage.getItem(DASHBOARD_CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache);

    if (!parsedCache?.cachedAt || Date.now() - parsedCache.cachedAt > DASHBOARD_CACHE_TTL) {
      window.sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
      return null;
    }

    return sanitizeDashboardData(parsedCache.data);
  } catch {
    window.sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
    return null;
  }
};

const setCachedDashboardData = (data) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        data,
      })
    );
  } catch {
    window.sessionStorage.removeItem(DASHBOARD_CACHE_KEY);
  }
};

export const getDashboardData = async () => {
  const requestConfig = buildAuthConfig();
  const [tasksResponse, roomsResponse] = await Promise.all([
    api.get("/api/tasks", requestConfig),
    api.get("/api/rooms", requestConfig),
  ]);

  const tasks = normalizeTasks(tasksResponse?.data?.data);
  const rooms = normalizeRooms(roomsResponse?.data?.data);
  const dashboardData = {
    tasks,
    rooms,
    stats: buildTaskStats(tasks),
  };

  setCachedDashboardData(dashboardData);

  return dashboardData;
};

export const getDashboardErrorMessage = (
  error,
  fallbackMessage = "We couldn’t load your dashboard. Please try again."
) =>
  error?.message === "Network Error"
    ? "Cannot connect to the server. Check that the backend is running."
    : fallbackMessage;
