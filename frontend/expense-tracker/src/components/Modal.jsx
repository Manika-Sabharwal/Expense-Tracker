import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-slate-900/30 p-4">
      <div className="relative p-0 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200">
          {/* Modal header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 rounded-t-xl">
            <h3 className="text-lg font-semibold text-slate-800">
              {title}
            </h3>

            <button
              type="button"
              className="text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l-6 6M7 7l6-6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-5 space-y-4 text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;