function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  rows = 4,
  className = "",
  required,
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`
          w-full px-4 py-3 text-sm text-slate-800 bg-white
          border-2 rounded-xl font-medium placeholder:text-slate-400
          transition-all duration-150 resize-none input-focus-ring
          ${error
            ? "border-red-400 bg-red-50/30 focus:border-red-400"
            : "border-slate-200 hover:border-slate-300"
          }
        `}
        {...props}
      />
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

export default Textarea;
