function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        
        {/* Modal panel */}
        <div className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} w-full border border-gray-100`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;

