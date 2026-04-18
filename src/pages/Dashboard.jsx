import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import {
  getCachedDashboardData,
  getDashboardData,
  getDashboardErrorMessage,
} from "../services/dashboardService";

const QUICK_ACTIONS = [
  {
    name: "Create Task",
    link: "/productivity",
    iconClassName: "bg-sky-50 text-sky-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    name: "Create Room",
    link: "/collaboration",
    iconClassName: "bg-indigo-50 text-indigo-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Join Room",
    link: "/collaboration",
    iconClassName: "bg-emerald-50 text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
      </svg>
    ),
  },
  {
    name: "Upload Resource",
    link: "/resources",
    iconClassName: "bg-violet-50 text-violet-600",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
      </svg>
    ),
  },
];

const getEntityId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};

const formatRelativeTime = (value) => {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return "";
  }

  return formatDistanceToNow(timestamp, { addSuffix: true });
};

function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [status, setStatus] = useState("loading");
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState("");
  const isLoading = status === "loading";
  const showStatSkeleton = isLoading && !hasFetched;
  const isRetrying = isLoading && hasFetched;

  const applyDashboardData = useCallback((dashboardData) => {
    setTasks(dashboardData.tasks);
    setRooms(dashboardData.rooms);
    setTaskStats(dashboardData.stats);
  }, []);

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setStatus("loading");
    }

    setError("");

    try {
      const dashboardData = await getDashboardData();

      applyDashboardData(dashboardData);
      setStatus("success");
    } catch (requestError) {
      console.error(requestError);

      if (requestError?.response?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      setError(getDashboardErrorMessage(requestError));
      setStatus("error");
    } finally {
      setHasFetched(true);
    }
  }, [applyDashboardData, logout, navigate]);

  useEffect(() => {
    const cachedDashboardData = getCachedDashboardData();

    if (cachedDashboardData) {
      applyDashboardData(cachedDashboardData);
      setStatus("success");
      setHasFetched(true);
    }

    loadDashboard({ silent: Boolean(cachedDashboardData) });
  }, [applyDashboardData, loadDashboard]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadDashboard({ silent: true });
    }, 30 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const completionRate = taskStats.totalTasks
      ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
      : 0;

    return [
      {
        title: "Tasks",
        value: String(taskStats.totalTasks),
        label: "All tasks",
        helper: `+${Math.max(taskStats.pendingTasks, 0)} needing attention`,
        progress: taskStats.totalTasks ? 100 : 0,
        to: "/productivity",
        iconClassName: "bg-sky-50 text-sky-600",
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      },
      {
        title: "Pending",
        value: String(taskStats.pendingTasks),
        label: "Need attention",
        helper: taskStats.pendingTasks === 0 ? "All clear right now" : "Open items to tackle next",
        progress: taskStats.totalTasks
          ? Math.round((taskStats.pendingTasks / taskStats.totalTasks) * 100)
          : 0,
        to: "/productivity",
        iconClassName: "bg-amber-50 text-amber-600",
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Completed",
        value: String(taskStats.completedTasks),
        label: "Finished",
        helper: `${completionRate}% completed`,
        progress: completionRate,
        to: "/productivity",
        iconClassName: "bg-emerald-50 text-emerald-600",
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
    ];
  }, [taskStats]);

  const recentActivity = useMemo(() => {
    const currentUserId = getEntityId(user);

    const taskActivity = tasks.map((task) => {
      const isCompleted = task.status === "completed";

      return {
        id: `task-${task._id}`,
        title: isCompleted ? `Task completed: ${task.title}` : `Task created: ${task.title}`,
        description: isCompleted
          ? "A task moved into your completed list."
          : "A new task was added to your workspace.",
        timestamp: task.createdAt,
        to: "/productivity",
        indicatorClassName: isCompleted ? "bg-emerald-500" : "bg-amber-500",
      };
    });

    const roomActivity = rooms.map((room) => {
      const isCreatedByUser = getEntityId(room.createdBy) === currentUserId;

      return {
        id: `room-${room._id}`,
        title: isCreatedByUser ? `Room created: ${room.name}` : `Joined room: ${room.name}`,
        description: isCreatedByUser
          ? "Your collaboration space is ready for members."
          : "You are now part of an active study room.",
        timestamp: room.createdAt,
        to: "/collaboration",
        indicatorClassName: "bg-sky-500",
      };
    });

    return [...taskActivity, ...roomActivity]
      .map((item) => {
        const parsedTimestamp = new Date(item.timestamp);

        return {
          ...item,
          parsedTimestamp,
        };
      })
      .filter((item) => !Number.isNaN(item.parsedTimestamp.getTime()))
      .sort((first, second) => second.parsedTimestamp - first.parsedTimestamp)
      .slice(0, 5);
  }, [rooms, tasks, user]);

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-600">Welcome back, {user?.name || "Student"}</p>
          {isRetrying ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Refreshing...
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-slate-900 sm:text-[2.8rem]">
          Your workspace overview
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Here&apos;s a quick overview of your activity.
        </p>
      </header>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            disabled={isLoading}
            className="font-ui inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            label={stat.label}
            helper={stat.helper}
            progress={stat.progress}
            to={stat.to}
            isLoading={showStatSkeleton}
            icon={stat.icon}
            iconClassName={stat.iconClassName}
          />
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-semibold leading-none tracking-tight text-slate-900">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-slate-600">Jump into the next thing you need to do.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className="group cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-card-hover"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${action.iconClassName}`}>
                {action.icon}
                </div>
                <p className="mt-4 font-ui text-sm font-medium text-slate-900">{action.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-semibold leading-none tracking-tight text-slate-900">
            Recent Activity
          </h2>
          <p className="mt-2 text-sm text-slate-600">The latest updates from your workspace.</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card">
          {showStatSkeleton ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-lg border border-slate-100 px-4 py-3">
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="divide-y divide-slate-200/80">
              {recentActivity.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="group flex items-start justify-between gap-4 rounded-2xl py-4 transition-all duration-200 ease-out first:pt-0 last:pb-0 hover:bg-slate-50/85"
                >
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-800 transition duration-200 group-hover:text-slate-900">
                      <span className={`h-2 w-2 rounded-full ${item.indicatorClassName}`} aria-hidden="true" />
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-600">{formatRelativeTime(item.timestamp)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-6">
              <p className="font-ui text-sm font-semibold text-slate-900">No activity yet</p>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                Create your first task or open a collaboration room to start building momentum.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/productivity"
                  className="font-ui inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-slate-800"
                >
                  Create Task
                </Link>
                <Link
                  to="/collaboration"
                  className="font-ui inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  Open Collaboration
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
