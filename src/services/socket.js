import { io } from "socket.io-client";

import { getStoredToken, isTokenExpired } from "../utils/auth";

export const socket = io("http://localhost:8000", {
  autoConnect: false,
});

let activeSocketToken = null;

export const connectSocket = (token) => {
  const nextToken = token || getStoredToken();

  if (!nextToken || isTokenExpired(nextToken)) {
    activeSocketToken = null;
    socket.auth = {};
    if (socket.connected) {
      socket.disconnect();
    }
    return socket;
  }

  const tokenChanged = activeSocketToken && activeSocketToken !== nextToken;

  activeSocketToken = nextToken;
  socket.auth = { token: nextToken };

  if (tokenChanged && socket.connected) {
    socket.disconnect();
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  activeSocketToken = null;
  socket.auth = {};

  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
