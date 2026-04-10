import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import ToastContainer from "../components/ToastContainer";
import SearchInput from "../components/SearchInput";
import { dummyTasks } from "../data/dummyData";

const PRIORITY_CONFIG = {
  high: { variant: "danger", label: "High", bar: "from-red-500 to-pink-500" },
  medium: { variant: "warning", label: "Medium", bar: "from-amber-500 to-orange-500" },
  low: { variant: "info", label: "Low", bar: "from-sky-500 to-cyan-500" },
};

const STATUS_CONFIG = {
  completed: { variant: "success", label: "Done" },
  "in-progress": { variant: "violet", label: "In Progress" },
  pending: { variant: "default", label: "Pending" },
};

const EMPTY_FORM = { title: "", description: "", priority: "medium", dueDate: "" };

function Productivity() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : dummyTasks;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => { localStorage.setItem("tasks", JSON.stringify(tasks)); }, [tasks]);

  const filteredTasks = useMemo(() =>
    tasks.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    }),
    [tasks, searchQuery, statusFilter, priorityFilter]
  );

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(task ? { title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate } : EMPTY_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const saveTask = () => {
    if (!validateForm()) return addToast("Please fix form errors", "error");
    setIsLoading(true);
    setTimeout(() => {
      if (editingTask) {
        setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...formData } : t));
        addToast("Task updated", "success");
      } else {
        setTasks((prev) => [...prev, { id: Date.now(), ...formData, status: "pending" }]);
        addToast("Task created", "success");
      }
      setIsLoading(false);
      closeModal();
    }, 300);
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast("Task deleted", "success");
  };

  const toggleStatus = (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const next = t.status === "completed" ? "pending" : "completed";
      addToast(`Marked as ${next}`, "success");
      return { ...t, status: next };
    }));
  };

  const clearFilters = () => { setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all"); };
  const hasFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all";

  // Stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ─── Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Productivity</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your tasks and stay organised</p>
        </div>
        <Button onClick={() => openModal()} size="md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      {/* ─── Stat pills ──────────────────────── */}
      {total > 0 && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total", value: total, color: "text-slate-700 bg-slate-100 border-slate-200" },
            { label: "Done", value: done, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { label: "In Progress", value: inProgress, color: "text-violet-700 bg-violet-50 border-violet-200" },
            { label: "Pending", value: total - done - inProgress, color: "text-amber-700 bg-amber-50 border-amber-200" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${s.color}`}>
              <span className="text-base font-extrabold">{s.value}</span> {s.label}
            </div>
          ))}
        </div>
      )}

      {/* ─── Search + Filters ────────────────── */}
      {total > 0 && (
        <Card variant="default" padding="md">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks…"
              className="flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none input-focus-ring bg-white hover:border-slate-300 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none input-focus-ring bg-white hover:border-slate-300 transition-colors"
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
          {hasFilters && filteredTasks.length !== total && (
            <p className="text-xs text-slate-500 mt-3 font-medium">
              Showing <strong className="text-brand-600">{filteredTasks.length}</strong> of <strong>{total}</strong> tasks
            </p>
          )}
        </Card>
      )}

      {/* ─── Empty States ────────────────────── */}
      {total === 0 ? (
        <Card variant="brand" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-5 shadow-button">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Create your first task to start managing your productivity</p>
            <Button onClick={() => openModal()} size="lg">Create First Task</Button>
          </div>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card variant="subtle" padding="lg">
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-500 text-sm mb-5">Try adjusting your search or filters</p>
            <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
          </div>
        </Card>
      ) : (
        /* ─── Task Grid ────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
            const sCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
            const isDone = task.status === "completed";

            return (
              <Card key={task.id} variant="default" padding="none" className="overflow-hidden group">
                {/* Priority bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${pCfg.bar}`} />

                <div className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={pCfg.variant} dot size="sm">{pCfg.label}</Badge>
                    <Badge variant={sCfg.variant} size="sm">{sCfg.label}</Badge>
                  </div>

                  {/* Title + description */}
                  <h3 className={`text-base font-bold mb-1.5 transition-colors ${isDone ? "line-through text-slate-400" : "text-slate-900 group-hover:text-brand-600"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{task.description}</p>
                  )}

                  {/* Due date */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button
                      variant={isDone ? "secondary" : "success"}
                      size="xs"
                      onClick={() => toggleStatus(task.id)}
                      className="flex-1"
                    >
                      {isDone ? "↩ Undo" : "✓ Done"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => openModal(task)}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={() => deleteTask(task.id)}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Modal ───────────────────────────── */}
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
            onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (formErrors.title) setFormErrors({ ...formErrors, title: "" }); }}
            placeholder="What needs to be done?"
            error={formErrors.title}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add more details (optional)"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none input-focus-ring bg-white hover:border-slate-300"
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
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>Cancel</Button>
            <Button onClick={saveTask} disabled={isLoading}>
              {isLoading ? "Saving…" : editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Productivity;
