"use client";
import BlogPageDesign from "@/components/BlogPageDesign";
import { useParams } from "next/navigation";
import React from "react";
import { useState } from "react";

export default function BlogPage() {
  const [DarkMode, setDarkMode] = useState(false);
  const resolvedParams = useParams();
  const { cid } = resolvedParams;
  return (
    <div
      className={` min-h-screen md:max-h-screen md:overflow-y-auto md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-[#00ADB5] md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:my-4 transition-all duration-300 ${DarkMode ? "bg-[#1A1A1B] md:[&::-webkit-scrollbar-track]:bg-[#1A1A1B]" : "bg-[#F9F9F7] md:[&::-webkit-scrollbar-track]:bg-[#F9F9F7]"}`}
    >
      <BlogPageDesign DarkMode={DarkMode} setDarkMode={setDarkMode} cid={cid} />
    </div>
  );
}
