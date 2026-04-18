import { useEffect, useMemo, useRef, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import SearchInput from "../components/SearchInput";
import Textarea from "../components/Textarea";
import ToastContainer from "../components/ToastContainer";
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

const EMPTY_FORM = { title: "", description: "", priority: "medium", dueDate: "" };
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

function Productivity() {
  const nextIdRef = useRef(0);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isDeletingTaskId, setIsDeletingTaskId] = useState(null);
  const [isTogglingTaskId, setIsTogglingTaskId] = useState(null);
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
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getTasks();
        setTasks(Array.isArray(response?.data) ? response.data : []);
      } catch (requestError) {
        console.log(requestError.response);
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
      console.log(requestError.response);
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
      console.log(requestError.response);
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
      console.log(requestError.response);
      const message = getTaskApiErrorMessage(requestError, "Unable to update task status.");
      setError(message);
      addToast(message, "error");
    } finally {
      setIsTogglingTaskId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const hasFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all";
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-900">
            Productivity
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Manage your tasks and stay organised</p>
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

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks…"
              className="w-full sm:min-w-[240px]"
            />
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:outline-none input-focus-ring"
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

        {!loading && total > 0 ? (
          <p className="text-sm text-slate-500">
            {total} total tasks
            <span className="mx-2 text-slate-300">•</span>
            {pending} pending
            <span className="mx-2 text-slate-300">•</span>
            {done} completed
          </p>
        ) : null}
      </section>

      {loading && tasks.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse"
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
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-ui text-base font-semibold text-slate-900">
            No tasks yet. Start by creating your first task.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first task to build momentum and keep your day on track.
          </p>
          <div className="mt-6">
            <Button onClick={() => openModal()} size="md">
              <span className="text-base leading-none">+</span>
              Create Your First Task
            </Button>
          </div>
        </div>
      ) : !loading && filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-ui text-base font-semibold text-slate-900">No tasks found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your search or filters.</p>
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
            const isDone = task.status === "completed";
            const isBusy =
              isSavingTask || isDeletingTaskId === task._id || isTogglingTaskId === task._id;

            return (
              <div
                key={task._id}
                onClick={() => !isBusy && openModal(task)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:bg-gray-50 hover:shadow-md"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && !isBusy) {
                    event.preventDefault();
                    openModal(task);
                  }
                }}
              >
                <div className="flex items-start gap-3">
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
                          <p
                            className={`text-sm font-semibold transition duration-200 ${
                              isDone ? "text-slate-400 line-through" : "text-slate-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <span
                            className={`font-ui inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${priorityConfig.className}`}
                          >
                            {priorityConfig.label}
                          </span>
                        </div>
                        {task.description ? (
                          <p
                            className={`mt-1.5 text-sm ${
                              isDone ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {task.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-ui inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.text}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>

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
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
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
          <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}

export default Productivity;
