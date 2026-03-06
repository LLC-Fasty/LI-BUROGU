"use client";
import { decodeSafe, LogOut } from "@/lib/utils";
import React, { useEffect } from "react";

export default function useUserInfo() {
  useEffect(() => {
    const token = localStorage.getItem("li-token");
    if (!token) {
      LogOut();
      return;
    }
    try {
      const decData = decodeSafe(token);
      const userData = JSON.parse(decData);

      const currentTime = new Date().getTime();

      if (!userData.expiresAt || currentTime > userData.expiresAt) {
        LogOut();
      }
    } catch (error) {
      LogOut();
    }
  }, []);
  return true;
}
