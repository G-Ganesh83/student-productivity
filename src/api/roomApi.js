import api from "./axios";

export const createRoom = async ({ name }) => {
  const response = await api.post("/api/rooms/create", { name });
  return response.data.data;
};

export const getRooms = async () => {
  const response = await api.get("/api/rooms");
  return response.data.data;
};

export const joinRoom = async ({ code }) => {
  const trimmedCode = code?.trim().toUpperCase();

  if (!trimmedCode) {
    throw new Error("Room code is required");
  }

  try {
    const response = await api.post("/api/rooms/join", { code: trimmedCode });
    return response.data.data;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
};

export const getRoomDetails = async (roomId) => {
  const response = await api.get(`/api/rooms/${roomId}`);
  return response.data.data;
};

export const leaveRoom = async ({ roomId }) => {
  const response = await api.post("/api/rooms/leave", { roomId });
  return response.data;
};

export const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong. Please try again."
) =>
  error?.message === "Network Error"
    ? "Cannot connect to server. Check backend."
    : error?.response?.data?.message || error?.message || fallbackMessage;
