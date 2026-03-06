import { decodeSafe } from "@/lib/utils";
import { useState, useEffect } from "react";

export const useUserGeoInfo = () => {
  const [ipAddress, setIpAddress] = useState("Detecting...");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("/api/ip");
        const ipDataEnc = await res.json();

        let ipData;

        try {
          const decoded = decodeSafe(ipDataEnc);
          ipData = JSON.parse(decoded);
        } catch {
          ipData = ipDataEnc;
        }

        setIpAddress(ipData.ip || "Unavailable");
      } catch (err) {
        setIpAddress("Unavailable");
      }
    };

    fetchIP();
  }, []);
  return { ipAddress };
};
