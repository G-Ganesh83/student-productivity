// Dummy data for the application

export const dummyTasks = [
  {
    id: 1,
    title: "Complete React assignment",
    description: "Finish the todo app with hooks",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Study for midterm exam",
    description: "Review chapters 1-5",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-01-20"
  },
  {
    id: 3,
    title: "Group project meeting",
    description: "Discuss project architecture",
    priority: "medium",
    status: "pending",
    dueDate: "2024-01-12"
  },
  {
    id: 4,
    title: "Read research paper",
    description: "Machine Learning fundamentals",
    priority: "low",
    status: "completed",
    dueDate: "2024-01-10"
  }
];

export const dummyRooms = [
  {
    id: "room-001",
    name: "CS 101 Study Group",
    description: "Data Structures and Algorithms",
    participants: 5,
    createdAt: "2024-01-01"
  },
  {
    id: "room-002",
    name: "Web Dev Project",
    description: "Building a React app",
    participants: 3,
    createdAt: "2024-01-05"
  },
  {
    id: "room-003",
    name: "Math Homework Help",
    description: "Calculus problems",
    participants: 8,
    createdAt: "2024-01-08"
  }
];

export const dummyResources = [
  {
    id: 1,
    title: "React Documentation",
    type: "link",
    url: "https://react.dev",
    tags: ["react", "frontend", "documentation"],
    uploadedAt: "2024-01-01"
  },
  {
    id: 2,
    title: "Data Structures Notes",
    type: "pdf",
    url: "#",
    tags: ["dsa", "notes", "computer-science"],
    uploadedAt: "2024-01-03"
  },
  {
    id: 3,
    title: "JavaScript Cheat Sheet",
    type: "pdf",
    url: "#",
    tags: ["javascript", "reference"],
    uploadedAt: "2024-01-05"
  },
  {
    id: 4,
    title: "Tailwind CSS Guide",
    type: "link",
    url: "https://tailwindcss.com",
    tags: ["css", "styling", "frontend"],
    uploadedAt: "2024-01-07"
  }
];

export const dummyStats = {
  tasks: {
    total: 12,
    completed: 8,
    pending: 4
  },
  rooms: {
    total: 5,
    active: 3
  },
  resources: {
    total: 15,
    recent: 3
  }
};

export const dummyParticipants = [
  { id: 1, name: "Alice Johnson", avatar: "AJ", online: true },
  { id: 2, name: "Bob Smith", avatar: "BS", online: true },
  { id: 3, name: "Charlie Brown", avatar: "CB", online: false },
  { id: 4, name: "Diana Prince", avatar: "DP", online: true }
];

