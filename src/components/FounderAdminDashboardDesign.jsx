"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateABlog from "./CreateABlog";
import AllBlogs from "./AllBlogs";
import { useUserGeoInfo } from "@/hooks/useUserGeoInfo";

export default function FounderAdminDashboardDesign() {
  const router = useRouter();
  const [Tab, setTab] = useState("All Blogs");
  const [isInitializing, setIsInitializing] = useState(true);
  const userInfo = useUserGeoInfo();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {isInitializing && (
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-center font-bold md:text-8xl text-2xl text-[#FFEE02] animate-pulse">
            Loading...
          </span>
        </div>
      )}
      {!isInitializing && (
        <div>
          <div className="md:flex justify-between items-center">
            <div className="p-4 flex items-center gap-4">
              <button
                onClick={() => {
                  router.push("/FounderAdmin");
                }}
                className={`p-2 cursor-pointer rounded-2xl hover:scale-110 hover:-rotate-15 transition-all duration-300 bg-[#F9F9F7]`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-10 h-10 transition-all duration-300 text-[#1A1A1B]`}
                  fill="none"
                  viewBox="0 0 320 390"
                >
                  <path
                    fill="currentColor"
                    d="M0 72.727C0 32.561 32.561 0 72.727 0A7.273 7.273 0 0 1 80 7.273V300c0 22.091-17.909 40-40 40S0 322.091 0 300z"
                  ></path>
                  <circle
                    cx="220"
                    cy="290"
                    r="100"
                    fill="currentColor"
                  ></circle>
                  <circle cx="200" cy="80" r="80" fill="#00ADB5"></circle>
                </svg>
              </button>
              <div>
                <h1 className="md:text-2xl text-base text-[#00ADB5] uppercase font-bold">
                  LI-Burogu
                </h1>
                <p className="text-[#FFEE02] text-sm uppercase leading-3 tracking-widest">
                  Founder Admin
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 px-4">
              <button
                onClick={() => setTab("All Blogs")}
                className="text-[#1A1A1B] bg-[#00ADB5] px-4 py-2 text-base font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
              >
                All Blogs
              </button>
              <button
                onClick={() => setTab("Create Blog")}
                className="text-[#1A1A1B] bg-[#FFEE02] px-4 py-2 text-base font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
              >
                Create Blog
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("li-token");
                  router.push("/");
                }}
                className="text-[#FF0808] bg-[#F9F9F7] px-4 py-2 text-base font-medium uppercase cursor-pointer rounded-xl hover:scale-110 transition-all duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
          <div className="md:p-6 p-2">
            <div
              className={`w-full border-4 ${Tab === "All Blogs" ? "border-[#00ADB5]" : "border-[#FFEE02]"} transition-all duration-300`}
            >
              {Tab === "All Blogs" && (
                <>
                  <AllBlogs userInfo={userInfo} />
                </>
              )}
              {Tab === "Create Blog" && (
                <>
                  <CreateABlog userInfo={userInfo} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
