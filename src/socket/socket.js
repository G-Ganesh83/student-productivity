import {
  socket as socketInstance,
  connectSocket,
  disconnectSocket,
} from "../services/socket";

export const socket = socketInstance;
export { connectSocket, disconnectSocket };

export const getSocket = () => socketInstance;

// Connection states: 'connected' | 'reconnecting' | 'disconnected'
let currentConnectionStatus = socketInstance.connected ? "connected" : "disconnected";
const statusListeners = new Set();

const setConnectionStatus = (status) => {
  if (currentConnectionStatus !== status) {
    currentConnectionStatus = status;
    statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error("Socket status listener error:", err);
      }
    });
  }
};

export const getSocketStatus = () => currentConnectionStatus;

export const subscribeSocketStatus = (listener) => {
  statusListeners.add(listener);
  listener(currentConnectionStatus);
  return () => {
    statusListeners.delete(listener);
  };
};

// Global socket listeners for connection state
socketInstance.on("connect", () => {
  setConnectionStatus("connected");
});

socketInstance.on("disconnect", (reason) => {
  if (reason === "io server disconnect" || reason === "io client disconnect") {
    setConnectionStatus("disconnected");
  } else {
    setConnectionStatus("reconnecting");
  }
});

socketInstance.on("connect_error", () => {
  setConnectionStatus("reconnecting");
});

if (socketInstance.io) {
  socketInstance.io.on("reconnect_attempt", () => {
    setConnectionStatus("reconnecting");
  });

  socketInstance.io.on("reconnect", () => {
    setConnectionStatus("connected");
  });

  socketInstance.io.on("reconnect_error", () => {
    setConnectionStatus("reconnecting");
  });

  socketInstance.io.on("reconnect_failed", () => {
    setConnectionStatus("disconnected");
  });
}

// Window online/offline sync for instant feedback
if (typeof window !== "undefined") {
  window.addEventListener("offline", () => {
    setConnectionStatus("disconnected");
  });

  window.addEventListener("online", () => {
    if (socketInstance.connected) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("reconnecting");
    }
  });
}

