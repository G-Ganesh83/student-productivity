import { Link } from "react-router-dom";
import Card from "../components/Card";
import { dummyStats } from "../data/dummyData";

const STAT_CONFIG = [
  {
    title: "Tasks",
    value: `${dummyStats.tasks.completed}`,
    total: `of ${dummyStats.tasks.total}`,
    label: "Completed",
    link: "/productivity",
    color: "brand",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    gradient: "from-indigo-500 to-violet-500",
    bg: "from-indigo-50 to-violet-50",
    border: "border-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    title: "Active Rooms",
    value: String(dummyStats.rooms.active),
    total: `of ${dummyStats.rooms.total}`,
    label: "Live sessions",
    link: "/collaboration",
    color: "sky",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: "from-sky-500 to-cyan-500",
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-100",
    textColor: "text-sky-600",
  },
  {
    title: "Resources",
    value: String(dummyStats.resources.total),
    total: `${dummyStats.resources.recent} recent`,
    label: "Study materials",
    link: "/resources",
    color: "emerald",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
    textColor: "text-emerald-600",
  },
];

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
    name: "Join Room",
    desc: "Enter with a Room ID",
    link: "/collaboration",
    gradient: "from-violet-500 to-purple-500",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
  },
  {
    name: "Upload Resource",
    desc: "Add study material",
    link: "/resources",
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-100",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ─── Header ─────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <p className="text-slate-500 font-medium text-sm">Welcome back</p>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Your Dashboard
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Here's a summary of everything happening in your workspace.
        </p>
      </div>

      {/* ─── Stats Grid ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STAT_CONFIG.map((stat) => (
          <Link key={stat.title} to={stat.link} className="group">
            <div className={`relative bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 shadow-card hover-lift overflow-hidden transition-all duration-200`}>
              {/* Background blob */}
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
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs font-semibold ${stat.textColor}`}>{stat.total}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Quick Actions ───────────────────── */}
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
