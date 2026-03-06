"use client";
import React from "react";

const ErrorBlogModal = ({ onClose, errorMessage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:p-10 p-4 bg-[#1A1A1B]/60 backdrop-blur-md">
      <div className="bg-[#1A1A1B] border-2 border-[#FF0808] w-full max-w-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(255,8,8,0.3)] animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex items-center justify-between gap-4">
          <h1 className="md:text-4xl text-2xl font-medium uppercase text-[#FF0808]">
            Error
          </h1>
          <p className="text-[#F9F9F7] font-medium md:text-sm text-xs opacity-70">
            Action Failed
          </p>
        </div>

        <div className="bg-[#FF0808] h-0.5"></div>

        <div className="md:p-8 p-4">
          <h1 className="text-[#F9F9F7] md:text-2xl text-lg text-center uppercase font-bold mb-4">
            Something Went Wrong
          </h1>
          <div className="bg-[#FF0808]/10 border border-[#FF0808]/30 p-4 rounded-lg">
            <p className="text-[#FF0808] text-center font-mono text-sm wrap-break-words">
              {errorMessage ||
                "AN UNKNOWN ERROR OCCURRED WHILE CREATING THE BLOG."}
            </p>
          </div>
        </div>

        <div className="bg-[#FF0808] h-0.5"></div>

        <div className="p-6">
          <button
            onClick={onClose}
            className="cursor-pointer w-full bg-[#FF0808] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#FF0808]/80 transition-all duration-300 text-[#F9F9F7] font-bold tracking-widest"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBlogModal;
