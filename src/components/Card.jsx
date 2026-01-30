function Card({ children, className = "", onClick, variant = "default" }) {
  const baseStyles = "bg-white rounded-2xl shadow-soft border border-gray-100/50 p-6 backdrop-blur-sm";
  const clickableStyles = onClick ? "cursor-pointer hover-lift" : "";
  
  const variants = {
    default: "bg-white",
    gradient: "bg-gradient-to-br from-white to-indigo-50/30",
    glass: "glass border-gray-200/50"
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${clickableStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export default Card;

