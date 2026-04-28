import api from "./axios";

export const startSession = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const response = await api.post("/api/sessions/start", { taskId });
  return response.data;
};

export const endSession = async (sessionId) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const response = await api.post("/api/sessions/end", { sessionId });
  return response.data;
};

export const getDailySessionSummary = async () => {
  const response = await api.get("/api/sessions/daily-summary");
  return response.data;
};

export const getWeeklySessionSummary = async () => {
  const response = await api.get("/api/sessions/weekly-summary");
  return response.data;
};

export const getTaskSessionInsights = async () => {
  const response = await api.get("/api/sessions/task-insights");
  return response.data;
};
