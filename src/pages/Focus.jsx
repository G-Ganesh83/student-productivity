import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FocusMode from "../components/FocusMode";
import { endSession as endSessionRequest } from "../api/sessionApi";

const ACTIVE_SESSION_STORAGE_KEY = "student-productivity-active-session";

const getStoredActiveSession = () => {
  try {
    const rawSession = window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);

    if (!parsedSession?.sessionId || !parsedSession?.startTime) {
      window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      return null;
    }

    return parsedSession;
  } catch {
    window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    return null;
  }
};

const clearStoredActiveSession = () => {
  window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
};

const formatElapsedTime = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

function Focus() {
  const location = useLocation();
  const navigate = useNavigate();
  const isStoppingRef = useRef(false);
  const storedSession = getStoredActiveSession();
  const routeState = location.state || {};
  const routeSession =
    routeState.activeSession ||
    (routeState.sessionId
      ? {
          sessionId: routeState.sessionId,
          taskId: routeState.taskId,
          taskName: routeState.taskName,
          startTime: routeState.startTime,
        }
      : null);
  const initialActiveSessionRef = useRef(routeSession?.sessionId ? { ...storedSession, ...routeSession } : storedSession);
  const initialActiveSession = initialActiveSessionRef.current;
  const [sessionId, setSessionId] = useState(initialActiveSession?.sessionId || null);
  const [startTime, setStartTime] = useState(initialActiveSession?.startTime || null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const [error, setError] = useState("");
  const taskName = initialActiveSession?.taskName || "Focus Session";

  useEffect(() => {
    if (!initialActiveSession?.sessionId || !initialActiveSession?.taskId || !initialActiveSession?.startTime) {
      return;
    }

    window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(initialActiveSession));
  }, [initialActiveSession]);

  useEffect(() => {
    if (!sessionId || !startTime) {
      setElapsedSeconds(0);
      return undefined;
    }

    const startTimestamp = new Date(startTime).getTime();

    if (Number.isNaN(startTimestamp)) {
      setElapsedSeconds(0);
      return undefined;
    }

    const updateElapsedTime = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000)));
    };

    updateElapsedTime();
    const intervalId = window.setInterval(updateElapsedTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sessionId, startTime]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/productivity", { replace: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleStop = async () => {
    if (!sessionId || isStoppingRef.current) {
      return;
    }

    try {
      isStoppingRef.current = true;
      setIsStopping(true);
      setError("");

      await endSessionRequest(sessionId);
      clearStoredActiveSession();
      setSessionId(null);
      setStartTime(null);
      setElapsedSeconds(0);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const message =
        requestError?.message === "Network Error"
          ? "Cannot connect to server. Check backend."
          : requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to stop session.";

      setError(message);
    } finally {
      isStoppingRef.current = false;
      setIsStopping(false);
    }
  };

  return (
    <FocusMode
      error={error}
      isStopping={isStopping}
      taskName={taskName}
      timer={sessionId && startTime ? formatElapsedTime(elapsedSeconds) : "00:00"}
      onBack={() => navigate("/productivity")}
      onStop={handleStop}
    />
  );
}

export default Focus;
