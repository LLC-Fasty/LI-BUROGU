"use client";
import HomeMainDesign from "@/components/HomeMainDesign";
import { useState } from "react";

export default function Home() {
  const [DarkMode, setDarkMode] = useState(false);
  return (
    <div
      className={` min-h-screen transition-all duration-300 ${DarkMode ? "bg-[#1A1A1B]" : "bg-[#F9F9F7]"}`}
    >
      <HomeMainDesign DarkMode={DarkMode} setDarkMode={setDarkMode} />
      <div></div>
    </div>
  );
}
