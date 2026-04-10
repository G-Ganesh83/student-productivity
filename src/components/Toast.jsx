import { useEffect } from "react";

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STYLES = {
  success: {
    container: "bg-white border-l-4 border-emerald-500",
    icon: "text-emerald-500",
    title: "text-emerald-800",
    text: "text-slate-600",
  },
  error: {
    container: "bg-white border-l-4 border-red-500",
    icon: "text-red-500",
    title: "text-red-800",
    text: "text-slate-600",
  },
  info: {
    container: "bg-white border-l-4 border-brand-500",
    icon: "text-brand-500",
    title: "text-brand-800",
    text: "text-slate-600",
  },
  warning: {
    container: "bg-white border-l-4 border-amber-500",
    icon: "text-amber-500",
    title: "text-amber-800",
    text: "text-slate-600",
  },
};

function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = STYLES[type] || STYLES.success;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-toast min-w-[300px] max-w-sm ${styles.container}`}
      style={{ animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      <span className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>{ICONS[type]}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${styles.title}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <p className={`text-xs mt-0.5 ${styles.text}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Toast;
