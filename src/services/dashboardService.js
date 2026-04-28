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

const DEFAULT_PRODUCTIVITY_STATS = {
  total: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  completionRate: 0,
  streak: 0,
};

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

const buildProductivityStats = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const overdue = tasks.filter((task) => {
    if (task.status !== "pending" || !task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    return !Number.isNaN(dueDate.getTime()) && dueDate < today;
  }).length;
  const total = completed + pending;

  return {
    ...DEFAULT_PRODUCTIVITY_STATS,
    total,
    completed,
    pending,
    overdue,
    completionRate: total ? Number(((completed / total) * 100).toFixed(2)) : 0,
  };
};

const normalizeProductivityStats = (payload, fallbackTasks = []) => {
  if (!payload || typeof payload !== "object") {
    return buildProductivityStats(fallbackTasks);
  }

  return {
    ...DEFAULT_PRODUCTIVITY_STATS,
    total: Number(payload.total) || 0,
    completed: Number(payload.completed) || 0,
    pending: Number(payload.pending) || 0,
    overdue: Number(payload.overdue) || 0,
    completionRate: Number(payload.completionRate) || 0,
    streak: Number(payload.streak) || 0,
  };
};

const sanitizeDashboardData = (payload = {}) => {
  const tasks = normalizeTasks(payload.tasks);
  const rooms = normalizeRooms(payload.rooms);

  return {
    tasks,
    rooms,
    stats: buildTaskStats(tasks),
    productivityStats: normalizeProductivityStats(payload.productivityStats, tasks),
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
  const [tasksResult, roomsResult, taskStatsResult] = await Promise.allSettled([
    api.get("/api/tasks", requestConfig),
    api.get("/api/rooms", requestConfig),
    api.get("/api/tasks/stats", requestConfig),
  ]);

  if (tasksResult.status === "rejected") {
    throw tasksResult.reason;
  }

  if (roomsResult.status === "rejected") {
    throw roomsResult.reason;
  }

  const tasks = normalizeTasks(tasksResult.value?.data?.data);
  const rooms = normalizeRooms(roomsResult.value?.data?.data);
  const productivityStats =
    taskStatsResult.status === "fulfilled"
      ? normalizeProductivityStats(taskStatsResult.value?.data?.data, tasks)
      : buildProductivityStats(tasks);
  const dashboardData = {
    tasks,
    rooms,
    stats: buildTaskStats(tasks),
    productivityStats,
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
