function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  className = "",
  required,
  icon,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-2.5 text-sm text-slate-800 bg-white
            border-2 rounded-xl font-medium placeholder:text-slate-400
            transition-all duration-150 input-focus-ring
            ${icon ? "pl-10" : ""}
            ${error
              ? "border-red-400 bg-red-50/30 focus:border-red-400"
              : "border-slate-200 hover:border-slate-300"
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export default Input;
