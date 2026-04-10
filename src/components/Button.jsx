function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none select-none";

  const variants = {
    primary:
      "gradient-brand text-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5 focus:ring-brand-400",
    secondary:
      "bg-white text-slate-700 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-0.5 focus:ring-brand-400",
    outline:
      "bg-transparent text-brand-600 border-2 border-brand-200 hover:bg-brand-50 hover:border-brand-300 hover:-translate-y-0.5 focus:ring-brand-400",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300",
    danger:
      "gradient-danger text-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5 focus:ring-red-400",
    success:
      "gradient-success text-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5 focus:ring-emerald-400",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs gap-1.5",
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    xl: "px-8 py-4 text-lg gap-3",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
