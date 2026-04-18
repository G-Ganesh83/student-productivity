import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { getRooms } from "../api/roomApi";
import { getTasks } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";

const QUICK_ACTIONS = [
  {
    name: "Add Task",
    desc: "Create a new task",
    link: "/productivity",
    gradient: "from-indigo-500 to-violet-500",
    bg: "from-indigo-50 to-violet-50",
    border: "border-indigo-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    name: "Create Room",
    desc: "Start a session",
    link: "/collaboration",
    gradient: "from-sky-500 to-indigo-500",
    bg: "from-sky-50 to-indigo-50",
    border: "border-sky-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Account Settings",
    desc: "Update your profile",
    link: "/settings",
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Help Center",
    desc: "Get support",
    link: "/help",
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [taskResponse, roomResponse] = await Promise.all([getTasks(), getRooms()]);

        if (!isMounted) {
          return;
        }

        setTasks(taskResponse?.data || []);
        setRooms(roomResponse || []);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = tasks.filter((task) => task.status !== "completed").length;
    const activeRooms = rooms.length;

    return [
      {
        title: "Tasks",
        value: String(completedTasks),
        total: `of ${tasks.length}`,
        label: "Completed",
        link: "/productivity",
        gradient: "from-indigo-500 to-violet-500",
        bg: "from-indigo-50 to-violet-50",
        border: "border-indigo-100",
        textColor: "text-indigo-600",
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        title: "Pending Tasks",
        value: String(pendingTasks),
        total: `${tasks.length} total`,
        label: "Still in progress",
        link: "/productivity",
        gradient: "from-amber-500 to-orange-500",
        bg: "from-amber-50 to-orange-50",
        border: "border-amber-100",
        textColor: "text-amber-600",
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Rooms",
        value: String(activeRooms),
        total: activeRooms === 1 ? "1 joined room" : `${activeRooms} joined rooms`,
        label: "Collaboration spaces",
        link: "/collaboration",
        gradient: "from-sky-500 to-cyan-500",
        bg: "from-sky-50 to-cyan-50",
        border: "border-sky-100",
        textColor: "text-sky-600",
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ];
  }, [rooms, tasks]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <p className="text-slate-500 font-medium text-sm">Welcome back, {user?.name || "Student"}</p>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Your Dashboard
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Here&apos;s a real-time summary of your tasks and collaboration spaces.
        </p>
      </div>

      {error && (
        <Card variant="subtle" padding="md">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link} className="group">
            <div className={`relative bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 shadow-card hover-lift overflow-hidden transition-all duration-200`}>
              <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full`} />

              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-button group-hover:scale-105 transition-transform duration-200`}>
                  {stat.icon}
                </div>
                <svg className={`w-4 h-4 mt-1 ${stat.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {isLoading ? "--" : stat.value}
                  </p>
                  <p className={`text-xs font-semibold ${stat.textColor}`}>{isLoading ? "Loading..." : stat.total}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Card variant="default" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full gradient-brand" />
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className={`group relative flex flex-col items-center text-center gap-3 p-5 rounded-xl border ${action.border} bg-gradient-to-br ${action.bg} hover-lift transition-all duration-200`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-button group-hover:scale-105 transition-transform duration-200`}>
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{action.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
