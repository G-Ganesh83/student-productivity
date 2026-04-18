import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Productivity",
    href: "/productivity",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "Collaboration",
    href: "/collaboration",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Resources",
    href: "/resources",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Help",
    href: "/help",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function AppLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-surface-1 flex">
      {/* ─── Desktop Sidebar ─────────────────── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-[#fdfdfd] border-r border-slate-200/60 z-30">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0 mt-1">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="text-base font-bold text-slate-800 tracking-tight hover:text-indigo-600 transition-colors"
          >
            LEARN EASY
          </Link>
          <button className="ml-auto w-6 h-6 rounded-md text-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Group */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative ${
                  active 
                    ? "font-semibold text-indigo-700 bg-indigo-50/80" 
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {/* Active left pill indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-md" />
                )}
                
                <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 space-y-1 mt-auto flex-shrink-0" />
      </aside>

      {/* ─── Mobile Top Bar (handled by TopNavbar) ── */}

      {/* ─── Mobile Drawer ────────────────────── */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
            style={{ animation: "fadeIn 0.18s ease both" }}
          />
          <div
            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            style={{ animation: "slideInLeft 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {/* Mobile Nav Area */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
              <Link 
                to="/" 
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-base font-bold text-slate-800 tracking-tight">LEARN EASY</span>
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                      active 
                        ? "font-semibold text-indigo-700 bg-indigo-50/80" 
                        : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-md" />
                    )}
                    <span className={active ? "text-indigo-600" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions Mobile */}
            <div className="px-3 py-4 space-y-1 border-t border-slate-100" />
          </div>
        </>
      )}

      {/* ─── Main Content ─────────────────────── */}
      <main className="flex-1 lg:pl-[240px] min-w-0 flex flex-col">
        {/* Premium top navbar */}
        <TopNavbar onMobileMenuOpen={() => setIsMobileOpen(true)} />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 page-enter">
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideInLeft {
          from { transform: translateX(-100%) }
          to { transform: translateX(0) }
        }
      `}</style>
    </div>
  );
}

export default AppLayout;
