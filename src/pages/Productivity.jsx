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

function Productivity() {
  // Load from localStorage or use dummy data
  const loadTasks = () => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : dummyTasks;
  };

  const [tasks, setTasks] = useState(loadTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === "" || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);
  
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: ""
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: ""
    });
    setFormErrors({});
  };
  
  const handleSaveTask = () => {
    if (!validateForm()) {
      addToast("Please fix the form errors", "error");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingTask) {
        setTasks(tasks.map(t => 
          t.id === editingTask.id 
            ? { ...t, ...formData }
            : t
        ));
        addToast("Task updated successfully", "success");
      } else {
        const newTask = {
          id: tasks.length + 1,
          ...formData,
          status: "pending"
        };
        setTasks([...tasks, newTask]);
        addToast("Task created successfully", "success");
      }
      setIsLoading(false);
      handleCloseModal();
    }, 300);
  };
  
  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== id));
      addToast("Task deleted successfully", "success");
    }
  };
  
  const handleToggleStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    const newStatus = task.status === "completed" ? "pending" : "completed";
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, status: newStatus }
        : t
    ));
    addToast(`Task marked as ${newStatus}`, "success");
  };
  
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "default";
      default: return "default";
    }
  };
  
  const getStatusVariant = (status) => {
    return status === "completed" ? "success" : "default";
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "from-red-500 to-pink-500";
      case "medium": return "from-amber-500 to-orange-500";
      case "low": return "from-blue-500 to-cyan-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Productivity
          </h1>
          <p className="text-lg text-gray-600">Manage your tasks and stay organized</p>
        </div>
        <Button onClick={() => handleOpenModal()} size="lg" className="shadow-lg">
          <span className="mr-2">+</span> Add Task
        </Button>
      </div>
      
      {/* Search and Filters */}
      {tasks.length > 0 && (
        <Card variant="glass" className="border-0">
          <div className="space-y-4">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full"
            />
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium bg-white"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            {filteredTasks.length !== tasks.length && (
              <p className="text-sm font-medium text-gray-600">
                Showing <span className="font-bold text-indigo-600">{filteredTasks.length}</span> of <span className="font-bold">{tasks.length}</span> tasks
              </p>
            )}
          </div>
        </Card>
      )}
      
      {/* Empty State */}
      {tasks.length === 0 ? (
        <Card variant="gradient" className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0">
          <div className="text-center py-16">
            <div className="text-7xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Get started by creating your first task</p>
            <Button onClick={() => handleOpenModal()} size="lg">
              Create Your First Task
            </Button>
          </div>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card variant="gradient" className="bg-gradient-to-br from-amber-50 to-orange-50 border-0">
          <div className="text-center py-16">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPriorityFilter("all");
            }} size="lg">
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        /* Tasks Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
          <Card key={task.id} variant="gradient" className="bg-gradient-to-br from-white to-gray-50/50 border-0 hover-lift group">
            <div className="relative">
              {/* Priority Indicator */}
              <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${getPriorityColor(task.priority)} rounded-r-2xl`}></div>
              
              <div className="pr-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors ${
                      task.status === "completed" ? "line-through text-gray-400" : ""
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{task.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getPriorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs">📅</span>
                    <p className="text-xs font-semibold text-gray-700">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(task.id)}
                    className="flex-1"
                  >
                    {task.status === "completed" ? "↩ Pending" : "✓ Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(task)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    🗑
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          ))}
        </div>
      )}
      
      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (formErrors.title) {
                setFormErrors({ ...formErrors, title: "" });
              }
            }}
            placeholder="Enter task title"
            error={formErrors.title}
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description"
            rows={4}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={isLoading}>
              {isLoading ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Productivity;

