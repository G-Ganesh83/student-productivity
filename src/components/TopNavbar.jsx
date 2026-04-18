import { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Page title map ─────────────────────────────────────────── */
const PAGE_META = {
  "/dashboard":     { title: "Dashboard",     emoji: "🏠" },
  "/productivity":  { title: "Productivity",  emoji: "✅" },
  "/collaboration": { title: "Collaboration", emoji: "👥" },
  "/resources":     { title: "Resources",     emoji: "📚" },
};

/* ─── Icon button wrapper ────────────────────────────────────── */
function NavIconBtn({ label, badge, children, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
    >
      {children}
      {badge > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-sm">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

/* ─── Search bar ─────────────────────────────────────────────── */
function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-xs lg:max-w-sm xl:max-w-md">
      {/* Search icon */}
      <div className="absolute left-3.5 flex items-center pointer-events-none">
        <svg
          className={`w-4 h-4 transition-colors duration-150 ${isFocused ? "text-indigo-500" : "text-slate-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search anything…"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full pl-10 pr-16 py-2.5
          text-sm font-medium text-slate-700 placeholder:text-slate-400
          bg-slate-50 rounded-xl
          border-2 transition-all duration-200
          focus:outline-none focus:bg-white
          ${isFocused
            ? "border-indigo-300 ring-3 ring-indigo-100 shadow-sm"
            : "border-slate-100 hover:border-slate-200 hover:bg-white"
          }
        `}
      />

      {/* ⌘K badge */}
      <div className={`absolute right-3 flex items-center gap-0.5 transition-opacity duration-150 ${isFocused ? "opacity-0" : "opacity-100"}`}>
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-500 text-[10px] font-bold border border-slate-200 shadow-sm">
          ⌘
        </kbd>
        <kbd className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-500 text-[10px] font-bold border border-slate-200 shadow-sm">
          K
        </kbd>
      </div>
    </div>
  );
}

/* ─── Avatar dropdown ────────────────────────────────────────── */
function AvatarMenu({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Account menu"
        className={`relative flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 ${open ? "bg-slate-100" : "hover:bg-slate-100"}`}
      >
        {/* Avatar + status */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Name + role — hidden on smaller screens */}
        <div className="hidden xl:block text-left leading-tight">
          <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{user?.name || "User"}</p>
          <p className="text-[11px] text-slate-500 font-medium">{user?.email || "Signed in"}</p>
        </div>

        {/* Chevron */}
        <svg
          className={`hidden xl:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 z-50 overflow-hidden"
          style={{ animation: "dropdownIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.email || "No email available"}</p>
          </div>

          {/* Menu items */}
          {[
            { label: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Settings", path: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Help & Support", path: "/help", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.path);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}

          <div className="border-t border-slate-100 mt-1.5 pt-1.5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

/* ─── Notifications panel (simple) ──────────────────────────── */
function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const NOTIFICATIONS = [
    { id: 1, title: "New task assigned", body: '"Complete React assignment" was added', time: "2m ago", unread: true },
    { id: 2, title: "Room invite",         body: 'Alice invited you to "Web Dev Project"', time: "18m ago", unread: true },
    { id: 3, title: "Resource shared",     body: 'Bob shared "Data Structures PDF"',      time: "1h ago",  unread: false },
  ];

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div ref={ref} className="relative">
      <NavIconBtn label="Notifications" badge={unreadCount} onClick={() => setOpen((p) => !p)}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </NavIconBtn>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-100 z-50 overflow-hidden"
          style={{ animation: "dropdownIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Mark all read
            </button>
          </div>

          {/* Items */}
          <div className="max-h-72 overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <button
                key={n.id}
                className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 transition-colors hover:bg-slate-50 ${n.unread ? "bg-indigo-50/40" : ""}`}
              >
                {/* Dot */}
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-indigo-500" : "bg-transparent border border-slate-300"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">{n.time}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 text-center">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
function TopNavbar({ onMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();
  const meta = PAGE_META[location.pathname] || { title: "LEARN EASY", emoji: "✦" };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-100 flex items-center"
      style={{ boxShadow: "0 1px 0 0 #f1f5f9, 0 2px 8px -2px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between w-full px-4 sm:px-6 gap-4">

        {/* ── LEFT ──────────────────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page breadcrumb / title */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
              className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 font-semibold hover:text-slate-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              LEARN EASY
            </Link>

            {/* Separator */}
            <svg className="hidden lg:block w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* Current page */}
            <span className="text-sm font-bold text-slate-800">{meta.title}</span>
          </div>
        </div>

        {/* ── CENTER: Search ────────────────────── */}
        <div className="flex-1 flex justify-center px-2 sm:px-4">
          <SearchBar />
        </div>

        {/* ── RIGHT: Actions ────────────────────── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Notifications */}
          <NotificationsPanel />

          {/* Settings */}
          <NavIconBtn label="Settings" onClick={() => navigate("/settings")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </NavIconBtn>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-150 mx-1" style={{ background: "#e8ecf0" }} />

          {/* Avatar + dropdown */}
          {isAuthenticated ? (
            <AvatarMenu user={user} onLogout={handleLogout} onNavigate={navigate} />
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
