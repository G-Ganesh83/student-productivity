import { Link } from "react-router-dom";
import Card from "../components/Card";
import { dummyStats } from "../data/dummyData";

function Dashboard() {
  const stats = [
    {
      title: "Tasks",
      value: `${dummyStats.tasks.completed}/${dummyStats.tasks.total}`,
      subtitle: "Completed",
      link: "/productivity",
      icon: "✓",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Active Rooms",
      value: dummyStats.rooms.active,
      subtitle: `of ${dummyStats.rooms.total} total`,
      link: "/collaboration",
      icon: "👥",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "Resources",
      value: dummyStats.resources.total,
      subtitle: `${dummyStats.resources.recent} recent`,
      link: "/resources",
      icon: "📚",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      iconBg: "bg-gradient-to-br from-indigo-500 to-purple-500"
    }
  ];
  
  const quickActions = [
    { name: "Add Task", icon: "✓", link: "/productivity", color: "from-emerald-500 to-teal-500" },
    { name: "Create Room", icon: "👥", link: "/collaboration", color: "from-violet-500 to-purple-500" },
    { name: "Join Room", icon: "🔗", link: "/collaboration", color: "from-blue-500 to-indigo-500" },
    { name: "Upload Resource", icon: "📤", link: "/resources", color: "from-orange-500 to-pink-500" }
  ];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">Welcome back! Here's an overview of your activity.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link key={stat.title} to={stat.link} className="group">
            <Card variant="gradient" className={`bg-gradient-to-br ${stat.bgGradient} border-0 hover-lift relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.subtitle}</p>
                </div>
                <div className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Quick Actions */}
      <Card variant="gradient" className="bg-gradient-to-br from-white to-indigo-50/50 border-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-transparent p-5 hover-lift"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-white transition-colors">{action.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;

