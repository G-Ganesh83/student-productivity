import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function AppLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Productivity", href: "/productivity", icon: "✓" },
    { name: "Collaboration", href: "/collaboration", icon: "👥" },
    { name: "Resources", href: "/resources", icon: "📚" },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 glass border-b border-gray-200/50 z-40 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StudyHub
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200/50 glass backdrop-blur-md">
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
      
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-72 glass border-r border-gray-200/50 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-6 border-b border-gray-200/50">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudyHub
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : "text-gray-700 hover:bg-white/50 hover:scale-105"
                }`}
              >
                <span className={`mr-3 text-xl transition-transform ${isActive(item.href) ? 'scale-110' : ''}`}>{item.icon}</span>
                {item.name}
                {isActive(item.href) && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </Link>
            ))}
          </nav>
          
          {/* User section */}
          <div className="px-4 py-6 border-t border-gray-200/50">
            <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  JD
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-600 font-medium">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-72 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

