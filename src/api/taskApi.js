import api from "./axios";

const TASK_PRIORITIES = new Set(["low", "medium", "high"]);
const TASK_CATEGORIES = new Set(["study", "coding", "lab", "assignment", "exam"]);

const normalizeTaskPayload = (data = {}) => {
  const payload = {
    title: data.title?.trim() || "",
    description: data.description?.trim() || "",
    priority: data.priority || "medium",
    category: data.category || "study",
    dueDate: data.dueDate || undefined,
  };

  if (!payload.title) {
    throw new Error("Title is required");
  }

  if (!TASK_PRIORITIES.has(payload.priority)) {
    throw new Error("Priority must be low, medium, or high");
  }

  if (!TASK_CATEGORIES.has(payload.category)) {
    throw new Error("Category must be study, coding, lab, assignment, or exam");
  }

  return payload;
};

export const getTaskApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong. Please try again."
) =>
  error?.message === "Network Error"
    ? "Cannot connect to server. Check backend."
    : error?.response?.data?.message || error?.message || fallbackMessage;

export const getTasks = async () => {
  const response = await api.get("/api/tasks");
  return response.data;
};

export const createTask = async (data) => {
  const payload = normalizeTaskPayload(data);
  const response = await api.post("/api/tasks", payload);

  return response.data;
};

export const updateTask = async (id, data) => {
  const payload = normalizeTaskPayload(data);
  const response = await api.put(`/api/tasks/${id}`, payload);

  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

export const toggleTaskStatus = async (id) => {
  const response = await api.patch(`/api/tasks/${id}/status`);
  return response.data;
};
