function Card({ children, className = "", onClick, variant = "default", padding = "md" }) {
  const base =
    "rounded-3xl transition-all duration-200 ease-out bg-white border border-slate-200/80";

  const variants = {
    default: "shadow-card",
    elevated: "shadow-panel",
    subtle: "bg-slate-50 shadow-none border-slate-200",
    gradient: "bg-gradient-to-br from-white to-slate-50/80 shadow-card",
    glass: "glass border-white/60 shadow-card",
    brand: "gradient-brand-subtle border-brand-100 shadow-card",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const clickable = onClick
    ? "cursor-pointer hover-lift hover:border-sky-100"
    : "";

  return (
    <div
      className={`${base} ${variants[variant]} ${paddings[padding]} ${clickable} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
