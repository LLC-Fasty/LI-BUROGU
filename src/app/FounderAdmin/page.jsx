"use client";
import FounderAdminDashboardDesign from "@/components/FounderAdminDashboardDesign";
import useUserInfo from "@/hooks/useUserInfo";
import React from "react";

export default function FounderAdminPage() {
  useUserInfo();
  return (
    <div className="min-h-screen bg-[#1A1A1B]">
      <div>
        <FounderAdminDashboardDesign />
      </div>
    </div>
  );
}
