"use client";
import React, { useState } from "react";

const CreateBlogModal = ({ onClose, heading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:p-10 p-4 bg-[#1A1A1B]/50 backdrop-blur-md">
      <div className="bg-[#1A1A1B] border-2 border-[#00ADB5] w-full overflow-hidden shadow-[0_0_50px_-12px_rgba(0,173,181,0.3)] animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex items-center justify-between gap-4">
          <h1 className="md:text-4xl text-2xl font-medium uppercase text-[#00ADB5]">
            Blog
          </h1>
          <p className="text-[#F9F9F7] font-medium md:text-sm text-xs">
            Publishing on {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <>
          <div className="bg-[#00ADB5] h-0.5"></div>
          <div className="md:p-6 p-2">
            <h1 className="text-[#00ADB5] md:text-2xl text-lg text-center uppercase font-bold">
              {heading}
            </h1>
            <h1 className="text-[#FFEE02] md:text-4xl text-lg text-center uppercase font-bold pt-4">
              Created Successfully!
            </h1>
          </div>
          <div className="bg-[#00ADB5] h-0.5"></div>
          <div className="p-6">
            <div className="md:flex items-center md:gap-6">
              <button
                onClick={onClose}
                className="cursor-pointer w-full bg-[#F9F9F7] uppercase px-4 py-2 md:text-lg text-base hover:bg-[#F9F9F7]/80 transition-all duration-300 text-[#1A1A1B] font-medium"
              >
                DONE
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default CreateBlogModal;
