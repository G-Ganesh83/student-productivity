import {
  socket as socketInstance,
  connectSocket,
  disconnectSocket,
} from "../services/socket";

export const socket = socketInstance;
export { connectSocket, disconnectSocket };

export const getSocket = () => socketInstance;
