import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import SearchInput from "../components/SearchInput";
import Textarea from "../components/Textarea";
import ToastContainer from "../components/ToastContainer";
import {
  endSession as endSessionRequest,
  startSession as startSessionRequest,
} from "../api/sessionApi";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTaskApiErrorMessage,
  getTasks,
  toggleTaskStatus as toggleTaskStatusRequest,
  updateTask as updateTaskRequest,
} from "../api/taskApi";

const STATUS_CONFIG = {
  completed: { label: "Completed", dot: "bg-emerald-500", text: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pending", dot: "bg-amber-500", text: "bg-amber-50 text-amber-700" },
};

const PRIORITY_CONFIG = {
  high: { label: "High", className: "bg-red-50 text-red-600 ring-red-100" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-600 ring-amber-100" },
  low: { label: "Low", className: "bg-emerald-50 text-emerald-600 ring-emerald-100" },
};

const CATEGORY_CONFIG = {
  study: { label: "Study", className: "bg-sky-50 text-sky-700 ring-sky-100" },
  coding: { label: "Coding", className: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
  lab: { label: "Lab", className: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
  assignment: { label: "Assignment", className: "bg-violet-50 text-violet-700 ring-violet-100" },
  exam: { label: "Exam", className: "bg-rose-50 text-rose-700 ring-rose-100" },
};

const CATEGORY_OPTIONS = [
  { value: "study", label: "Study" },
  { value: "coding", label: "Coding" },
  { value: "lab", label: "Lab" },
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
];

const EMPTY_FORM = { title: "", description: "", priority: "medium", category: "study", dueDate: "" };
const ACTIVE_SESSION_STORAGE_KEY = "student-productivity-active-session";
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

const isTaskOverdue = (task) => {
  if (task.status !== "pending" || !task.dueDate) {
    return false;
  }

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return dueDate < today;
};

const formatElapsedTime = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const getStoredActiveSession = () => {
  try {
    const rawSession = window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);

    if (!parsedSession?.sessionId || !parsedSession?.taskId || !parsedSession?.startTime) {
      window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      return null;
    }

    return {
      sessionId: parsedSession.sessionId,
      taskId: parsedSession.taskId,
      startTime: parsedSession.startTime,
      taskName: parsedSession.taskName,
    };
  } catch {
    window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    return null;
  }
};

const storeActiveSession = ({ sessionId, startTime, taskId, taskName }) => {
  window.localStorage.setItem(
    ACTIVE_SESSION_STORAGE_KEY,
    JSON.stringify({
      sessionId,
      startTime,
      taskId,
      taskName,
    })
  );
};

const clearStoredActiveSession = () => {
  window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
};

function Productivity() {
  const navigate = useNavigate();
  const nextIdRef = useRef(0);
  const isStartingSessionRef = useRef(false);
  const isEndingSessionRef = useRef(false);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionModeTask, setSessionModeTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isDeletingTaskId, setIsDeletingTaskId] = useState(null);
  const [isTogglingTaskId, setIsTogglingTaskId] = useState(null);
  const [isStartingSessionTaskId, setIsStartingSessionTaskId] = useState(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const getNextId = () => {
    nextIdRef.current += 1;
    return nextIdRef.current;
  };

  const addToast = (message, type = "success") => {
    const id = getNextId();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  useEffect(() => {
    const storedSession = getStoredActiveSession();

    if (storedSession) {
      setActiveSession(storedSession);
    }

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getTasks();
        setTasks(Array.isArray(response?.data) ? response.data : []);
      } catch (requestError) {
        const message = getTaskApiErrorMessage(requestError, "Unable to load tasks.");
        setError(message);
        const id = getNextId();
        setToasts((prev) => [...prev, { id, message, type: "error" }]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!activeSession?.sessionId || !activeSession?.startTime) {
      setElapsedSeconds(0);
      return undefined;
    }

    const startTimestamp = new Date(activeSession.startTime).getTime();

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
  }, [activeSession]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const query = searchQuery.toLowerCase();
        const matchSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description || "").toLowerCase().includes(query);
        const matchStatus = statusFilter === "all" || task.status === statusFilter;
        const matchPriority = priorityFilter === "all" || task.priority === priorityFilter;

        return matchSearch && matchStatus && matchPriority;
      }),
    [tasks, searchQuery, statusFilter, priorityFilter]
  );

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(
      task
        ? {
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            category: task.category || "study",
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
          }
        : EMPTY_FORM
    );
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const openSessionModeModal = (task) => {
    if (activeSession) {
      addToast("Finish current session first", "error");
      return;
    }

    setSessionModeTask(task);
  };

  const closeSessionModeModal = () => {
    if (!isStartingSessionTaskId) {
      setSessionModeTask(null);
    }
  };

  const saveTask = async () => {
    if (!validateForm()) {
      addToast("Please fix form errors", "error");
      return;
    }

    try {
      setIsSavingTask(true);
      setError("");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || undefined,
      };

      if (editingTask) {
        const response = await updateTaskRequest(editingTask._id, payload);
        const updatedTask = response?.data;

        if (updatedTask) {
          setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        }

        addToast("Task updated", "success");
      } else {
        const response = await createTaskRequest(payload);
        const newTask = response?.data;

        if (newTask) {
          setTasks((prev) => [newTask, ...prev]);
        }

        addToast("Task created", "success");
      }

      closeModal();
    } catch (requestError) {
      const message = getTaskApiErrorMessage(requestError, "Unable to save task.");
      setError(message);
      addToast(message, "error");
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      setIsDeletingTaskId(id);
      setError("");
      await deleteTaskRequest(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      addToast("Task deleted", "success");
    } catch (requestError) {
      const message = getTaskApiErrorMessage(requestError, "Unable to delete task.");
      setError(message);
      addToast(message, "error");
    } finally {
      setIsDeletingTaskId(null);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setIsTogglingTaskId(id);
      setError("");
      const response = await toggleTaskStatusRequest(id);
      const updatedTask = response?.data;

      if (updatedTask) {
        setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        addToast("Status updated", "success");
      }
    } catch (requestError) {
      const message = getTaskApiErrorMessage(requestError, "Unable to update task status.");
      setError(message);
      addToast(message, "error");
    } finally {
      setIsTogglingTaskId(null);
    }
  };

  const handleStartSession = async (mode) => {
    if (!sessionModeTask || activeSession || isStartingSessionRef.current) {
      return;
    }

    try {
      isStartingSessionRef.current = true;
      setIsStartingSessionTaskId(sessionModeTask._id);
      setError("");

      const response = await startSessionRequest(sessionModeTask._id);
      const session = response?.data;

      if (!session?._id) {
        throw new Error("Unable to start session.");
      }

      const startTime = session.startTime || new Date().toISOString();
      const nextActiveSession = {
        sessionId: session._id,
        taskId: sessionModeTask._id,
        startTime,
        taskName: sessionModeTask.title,
      };

      setActiveSession(nextActiveSession);
      storeActiveSession(nextActiveSession);
      addToast("Session started", "success");
      setSessionModeTask(null);

      if (mode === "focus") {
        navigate("/focus", {
          state: {
            activeSession: nextActiveSession,
          },
        });
      }
    } catch (requestError) {
      const message = getTaskApiErrorMessage(requestError, "Unable to start session.");
      setError(message);
      addToast(message, "error");
    } finally {
      isStartingSessionRef.current = false;
      setIsStartingSessionTaskId(null);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession?.sessionId || isEndingSessionRef.current) {
      return;
    }

    const sessionToEnd = activeSession;

    try {
      isEndingSessionRef.current = true;
      setIsEndingSession(true);
      setError("");

      await endSessionRequest(sessionToEnd.sessionId);
      setActiveSession(null);
      setElapsedSeconds(0);
      clearStoredActiveSession();
      addToast("Session ended", "success");
    } catch (requestError) {
      const message = getTaskApiErrorMessage(requestError, "Unable to end session.");
      setError(message);
      addToast(message, "error");
    } finally {
      isEndingSessionRef.current = false;
      setIsEndingSession(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const openFocusMode = (task) => {
    if (!activeSession?.sessionId || !activeSession?.startTime) {
      return;
    }

    const currentActiveSession = {
      ...activeSession,
      taskId: activeSession.taskId || task._id,
      taskName: activeSession.taskName || task.title,
    };

    storeActiveSession(currentActiveSession);
    setActiveSession(currentActiveSession);
    navigate("/focus", {
      state: {
        activeSession: currentActiveSession,
      },
    });
  };

  const hasFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all";
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-900">
            Plan your work
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Manage your tasks and stay organised</p>
        </div>
        <Button onClick={() => openModal()} size="md" disabled={loading}>
          <span className="text-base leading-none">+</span>
          Create Task
        </Button>
      </div>

      {error && (
        <Card variant="subtle" padding="md" className="border border-red-200 bg-red-50">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </Card>
      )}

      <section>
        <Card variant="default" padding="md" className="border-slate-200 bg-white/95">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = statusFilter === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`font-ui rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-sky-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center xl:justify-end">
              <SearchInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks…"
                className="w-full lg:min-w-[280px]"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  className="h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:outline-none input-focus-ring"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {hasFilters && (
                  <Button variant="ghost" size="md" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {!loading && total > 0 ? (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600">
                {total} total tasks
                <span className="mx-2 text-slate-300">•</span>
                {pending} pending
                <span className="mx-2 text-slate-300">•</span>
                {done} completed
              </p>
            </div>
          ) : null}
        </Card>
      </section>

      {loading && tasks.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 rounded border border-slate-200 bg-slate-100" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-40 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
                  <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : !loading && total === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-card">
          <p className="font-ui text-base font-semibold text-slate-900">
            No activity yet. Start your first session to track productivity.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Create your first task, then start a session to build your focus history.
          </p>
          <div className="mt-6">
            <Button onClick={() => openModal()} size="md">
              <span className="text-base leading-none">+</span>
              Create Your First Task
            </Button>
          </div>
        </div>
      ) : !loading && filteredTasks.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-card">
          <p className="font-ui text-base font-semibold text-slate-900">No tasks found</p>
          <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filters.</p>
          <div className="mt-6">
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
            const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            const categoryConfig = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.study;
            const isDone = task.status === "completed";
            const isOverdue = isTaskOverdue(task);
            const isActiveSessionTask = activeSession?.taskId === task._id;
            const hasOtherActiveSession = Boolean(activeSession) && !isActiveSessionTask;
            const isStartingSession = isStartingSessionTaskId === task._id;
            const isBusy =
              isSavingTask ||
              isDeletingTaskId === task._id ||
              isTogglingTaskId === task._id ||
              isStartingSession;

            return (
              <div
                key={task._id}
                onClick={() => !isBusy && openModal(task)}
                className={`cursor-pointer rounded-3xl border p-5 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                  isActiveSessionTask
                    ? "scale-[1.01] border-sky-300 bg-gradient-to-r from-sky-50 via-white to-sky-50 shadow-[0_22px_55px_-30px_rgba(14,165,233,0.75)] ring-1 ring-sky-200/80"
                    : "border-slate-200/80 bg-white hover:bg-slate-50/80"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && !isBusy) {
                    event.preventDefault();
                    openModal(task);
                  }
                }}
              >
                <div className="flex items-start gap-5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleStatus(task._id);
                    }}
                    disabled={isBusy}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition duration-200 ${
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-transparent hover:border-slate-400"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                    aria-label={isDone ? "Mark task as pending" : "Mark task as completed"}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div className="min-w-0 flex-1 space-y-3.5">
                        <div className="flex items-start gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
                          <p
                            className={`min-w-0 text-base font-medium leading-6 transition-all duration-200 ${
                              isDone ? "text-slate-400 line-through" : "text-slate-900"
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-ui inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ring-1 ${categoryConfig.className}`}
                          >
                            {categoryConfig.label}
                          </span>
                          <span
                            className={`font-ui inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ring-1 ${priorityConfig.className}`}
                          >
                            {priorityConfig.label}
                          </span>
                        </div>
                        {task.description ? (
                          <p
                            className={`text-sm leading-6 ${
                              isDone ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {task.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-4 lg:justify-end">
                        {isActiveSessionTask ? (
                          <div className="min-w-[120px] text-left text-sky-700 transition-all duration-200 lg:text-center">
                            <p className="text-[11px] font-medium leading-none text-slate-500">
                              Running
                            </p>
                            <p className="mt-1 text-[11px] font-medium leading-none text-slate-500">
                              Focus Time
                            </p>
                            <p className="mt-2 font-ui text-3xl font-bold leading-none text-sky-950 pulse-dot transition-all duration-200">
                              {formatElapsedTime(elapsedSeconds)}
                            </p>
                          </div>
                        ) : null}
                        {isActiveSessionTask ? (
                          <>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openFocusMode(task);
                              }}
                              className="font-ui inline-flex h-10 items-center rounded-full bg-sky-600 px-5 text-xs font-semibold text-white shadow-sm shadow-sky-200/80 transition-all duration-200 hover:scale-[1.02] hover:bg-sky-700 hover:shadow-md"
                            >
                              Focus Mode
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEndSession();
                              }}
                              disabled={isEndingSession}
                              className="font-ui inline-flex h-10 items-center rounded-full bg-red-500 px-5 text-xs font-semibold text-white shadow-sm shadow-red-200/80 transition-all duration-200 hover:scale-[1.02] hover:bg-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isEndingSession ? "Stopping..." : "Stop Session"}
                            </button>
                          </>
                        ) : null}

                        {!isDone && !isActiveSessionTask ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openSessionModeModal(task);
                            }}
                            disabled={isBusy || hasOtherActiveSession}
                            title={hasOtherActiveSession ? "Finish current session first" : undefined}
                            className="font-ui inline-flex h-10 items-center rounded-full bg-sky-600 px-5 text-xs font-semibold text-white shadow-sm shadow-sky-200/80 transition-all duration-200 hover:scale-[1.02] hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-sm"
                          >
                            {isStartingSession ? "Starting..." : "Start Session"}
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                          disabled={isBusy}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Delete task"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {task.dueDate ? (
                      <div
                        className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
                          isOverdue ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "New Task"}
        description={editingTask ? "Update the task details below" : "Fill in the details for your new task"}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(event) => {
              setFormData({ ...formData, title: event.target.value });
              if (formErrors.title) {
                setFormErrors({ ...formErrors, title: "" });
              }
            }}
            placeholder="What needs to be done?"
            error={formErrors.title}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            placeholder="Add more details (optional)"
            rows={3}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 focus:outline-none input-focus-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 focus:outline-none input-focus-ring"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal} disabled={isSavingTask}>
              Cancel
            </Button>
            <Button onClick={saveTask} disabled={isSavingTask || !formData.title.trim()}>
              {isSavingTask ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(sessionModeTask)}
        onClose={closeSessionModeModal}
        title="Start Session"
        description={sessionModeTask ? `Choose how you want to work on "${sessionModeTask.title}".` : ""}
        size="sm"
      >
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleStartSession("focus")}
            disabled={Boolean(isStartingSessionTaskId)}
            className="group w-full rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-left transition duration-200 hover:border-sky-200 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="block text-sm font-semibold text-slate-900">
              {isStartingSessionTaskId ? "Starting..." : "Focus Mode"}
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Open a clean full-screen timer for deep work.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleStartSession("normal")}
            disabled={Boolean(isStartingSessionTaskId)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="block text-sm font-semibold text-slate-900">
              {isStartingSessionTaskId ? "Starting..." : "Normal Mode"}
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              Stay on this page and track time quietly.
            </span>
          </button>

          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="md"
              onClick={closeSessionModeModal}
              disabled={Boolean(isStartingSessionTaskId)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Productivity;
