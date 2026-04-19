import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import TopNavbar from "../components/TopNavbar";

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
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
    <div className="flex min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_58%,#f8fbfe_100%)]">
      {/* ─── Desktop Sidebar ─────────────────── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[284px] flex-col border-r border-slate-200/80 bg-[#F8FAFC] shadow-sidebar z-30">
        
        {/* Logo Area */}
        <div className="px-6 pb-5 pt-6 flex-shrink-0">
          <BrandLogo
            to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          />
        </div>

        {/* Navigation Group */}
        <nav className="flex-1 px-4 py-3.5 space-y-2 overflow-y-auto scrollbar-thin">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Workspace
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ease-out ${
                  active 
                    ? "font-medium text-slate-800 bg-sky-50/65 shadow-[inset_0_0_0_1px_rgba(240,249,255,0.95)]" 
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                {/* Active left pill indicator */}
                {active && (
                  <div className="absolute left-2 top-1/2 h-6 w-px -translate-y-1/2 rounded-full bg-sky-400/90 shadow-[0_0_8px_rgba(56,189,248,0.14)]" />
                )}
                
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white/90 text-sky-600"
                    : "bg-white/70 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:ring-1 group-hover:ring-slate-200/80"
                }`}>
                  {item.icon}
                </span>
                <span className="font-ui tracking-[-0.01em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto px-4 pb-5 pt-3 flex-shrink-0">
          <div className="rounded-3xl border border-slate-200 bg-white/85 px-4 py-4">
            <p className="font-ui text-sm font-semibold text-slate-900">Need help navigating?</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Visit Help for quick guidance on rooms, tasks, and resources.
            </p>
            <Link
              to="/help"
              className="font-ui mt-4 inline-flex items-center text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800"
            >
              Open help
            </Link>
          </div>
        </div>
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
            className="lg:hidden fixed inset-y-0 left-0 z-50 flex w-[min(20rem,86vw)] flex-col bg-white shadow-2xl"
            style={{ animation: "slideInLeft 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {/* Mobile Nav Area */}
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
              <BrandLogo
                to="/"
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  setIsMobileOpen(false);
                }}
              />
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

            <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                      active 
                        ? "font-semibold text-sky-800 bg-sky-50" 
                        : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-sky-500" />
                    )}
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      active ? "bg-white text-sky-600 ring-1 ring-sky-100" : "bg-slate-50 text-slate-400"
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-ui">{item.name}</span>
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
      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden lg:pl-[284px]">
        {/* Premium top navbar */}
        <TopNavbar onMobileMenuOpen={() => setIsMobileOpen(true)} />
        <div className="page-enter flex-1 w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(224,242,254,0.28),_rgba(255,255,255,0)_28%),linear-gradient(180deg,#ffffff_0%,#fcfdff_100%)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
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
