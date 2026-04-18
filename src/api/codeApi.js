import api from "./axios";

export const runCode = async ({ language, code }) => {
  const response = await api.post("/api/code/run", { language, code });
  return response.data;
};

export const getCodeExecutionError = (
  error,
  fallbackMessage = "Unable to run code right now."
) => error?.response?.data?.error || error?.response?.data?.message || fallbackMessage;
