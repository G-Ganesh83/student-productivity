function Badge({ children, variant = "default", size = "sm", dot = false, className = "" }) {
  const base = "inline-flex items-center font-semibold rounded-full tracking-wide";

  const variants = {
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    primary: "bg-brand-50 text-brand-700 border border-brand-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    violet: "bg-violet-50 text-violet-700 border border-violet-200",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-brand-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    violet: "bg-violet-500",
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

export default Badge;
