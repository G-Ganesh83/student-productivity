import { useEffect, useState } from "react";
import { getSocketStatus, subscribeSocketStatus } from "../socket/socket";

/**
 * Reconnection banner component that displays real-time network and socket drop alerts.
 */
export default function NetworkStatus({ className = "" }) {
  const [status, setStatus] = useState(getSocketStatus);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = subscribeSocketStatus(setStatus);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isDisconnected = !isOnline || status === "disconnected";
  const isReconnecting = isOnline && status === "reconnecting";

  if (!isDisconnected && !isReconnecting) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`flex items-center justify-center gap-2.5 px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isDisconnected
          ? "bg-rose-50 border-b border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300"
          : "bg-amber-50 border-b border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300"
      } ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isDisconnected ? "bg-rose-400" : "bg-amber-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isDisconnected ? "bg-rose-500" : "bg-amber-500"
          }`}
        />
      </span>
      <span>
        {!isOnline
          ? "You are offline. Please check your internet connection."
          : isDisconnected
          ? "Disconnected from collaboration server. Attempting to reconnect..."
          : "Connection lost. Reconnecting to the collaboration server..."}
      </span>
    </div>
  );
}

/**
 * Real-time connection badge for header bars or status panels.
 */
export function ConnectionBadge({ className = "" }) {
  const [status, setStatus] = useState(getSocketStatus);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const unsubscribe = subscribeSocketStatus(setStatus);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isConnected = isOnline && status === "connected";
  const isReconnecting = isOnline && status === "reconnecting";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        isConnected
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
          : isReconnecting
          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isConnected
            ? "bg-emerald-500"
            : isReconnecting
            ? "bg-amber-500 animate-pulse"
            : "bg-rose-500"
        }`}
      />
      <span>
        {isConnected ? "Connected" : isReconnecting ? "Reconnecting" : "Disconnected"}
      </span>
    </div>
  );
}

