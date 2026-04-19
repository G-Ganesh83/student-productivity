import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PAGE_META = {
  "/dashboard": { title: "Dashboard", subtitle: "Your overview, activity, and quick actions." },
  "/productivity": { title: "Productivity", subtitle: "Organize tasks, priorities, and deadlines." },
  "/collaboration": { title: "Collaboration", subtitle: "Create rooms, join teams, and work together live." },
  "/resources": { title: "Resources", subtitle: "Keep notes, links, and references within reach." },
  "/settings": { title: "Settings", subtitle: "Manage account details and session preferences." },
  "/help": { title: "Help & Support", subtitle: "Quick answers and guidance across the workspace." },
};

function useDismissOnOutsideClick(ref, onClose) {
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose, ref]);
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function AvatarMenu({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U",
    [user?.name]
  );

  useDismissOnOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-label="Account menu"
        className={`inline-flex items-center gap-2.5 rounded-lg px-2 py-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white ${
          open ? "bg-gray-100" : "hover:bg-gray-100"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
          {initials}
        </div>

        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-sm font-semibold leading-5 text-slate-900">{user?.name || "User"}</p>
        </div>

        <svg
          className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.9}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 py-1.5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email || "No email available"}</p>
          </div>

          {[
            {
              label: "Dashboard",
              path: "/dashboard",
              icon: "M3 12l2-2 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6",
            },
            {
              label: "Settings",
              path: "/settings",
              icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
            },
            {
              label: "Help & Support",
              path: "/help",
              icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.path);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}

          <div className="mt-1.5 border-t border-slate-100 pt-1.5">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m17 16 4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TopNavbar({ onMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();
  const meta = PAGE_META[location.pathname] || {
    title: "Workspace",
    subtitle: "Manage your work from one place.",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between gap-6 px-6 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-gray-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] lg:hidden"
            aria-label="Open navigation"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">
            {meta.title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <IconButton label="Settings" onClick={() => navigate("/settings")}>
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </IconButton>

          {isAuthenticated ? (
            <AvatarMenu user={user} onLogout={handleLogout} onNavigate={navigate} />
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
