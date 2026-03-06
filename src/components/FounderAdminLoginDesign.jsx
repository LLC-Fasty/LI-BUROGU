"use client";
import { useUserGeoInfo } from "@/hooks/useUserGeoInfo";
import { encodeSafe } from "@/lib/utils";
import { adminLogin } from "@/services/CreateBlogService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function FounderAdminLoginDesign() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userInfo = useUserGeoInfo();

  const handleLogin = async () => {
    if (!key) return setError("KEY REQUIRED");

    setLoading(true);
    setError("");

    let lData = encodeSafe(
      JSON.stringify({
        adminKey: key,
        ip: userInfo.ipAddress,
      }),
    );
    const res = await adminLogin(lData);

    if (res.success) {
      router.push("/FounderAdmin");
    } else {
      setError(res.error);
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="md:text-8xl text-4xl text-[#00ADB5] uppercase font-medium text-center">
          LI-Burogu
        </h1>
        <p className="text-sm uppercase tracking-widest font-bold text-[#FFEE02] text-center">
          Founder Admin LogIn
        </p>
        <div className="py-2"></div>
        <div className="border-4 border-[#00ADB5] w-full p-4">
          {error && error.length > 1 && (
            <p className="text-center text-[#FF0808] text-xs font-bold uppercase mb-2 ">
              {error}
            </p>
          )}
          <div className="pb-2">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter Admin Key"
              className="w-full bg-[#FFEE02] px-4 py-2 text-lg text-center font-medium tracking-widest outline-none text-[#1A1A1B]"
            />
          </div>
          <div className="pt-2">
            <div className="group border-4 border-[#00ADB5] p-2 hover:p-0 transition-all duration-300">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-[#00ADB5] cursor-pointer w-full px-4 py-1 uppercase text-lg font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-50"
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
        <div className="py-2"></div>
        <div className="flex justify-center">
          <p className="text-sm uppercase tracking-widest font-bold text-[#FFEE02] text-center w-125">
            This is a protected page. Only the founder admin can access this
            page. Please enter the correct admin key to generate the OTP and log
            in to the founder admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
