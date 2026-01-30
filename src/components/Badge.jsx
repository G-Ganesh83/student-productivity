function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200",
    primary: "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200",
    success: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200",
    warning: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200",
    danger: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;

