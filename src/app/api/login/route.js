import { NextResponse } from "next/server";
import { decodeSafe, encodeSafe } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const decData = decodeSafe(body);
    const { adminKey, ip } = JSON.parse(decData);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateSuffix = `${day}${month}${year}`;

    const MASTER_KEY = process.env.LOGINPID_ADMIN + dateSuffix;

    if (adminKey === MASTER_KEY) {
      const expiryTime = new Date().getTime() + 3 * 60 * 60 * 1000;

      const tokenPayload = JSON.stringify({
        ip: ip,
        status: "logsuccess",
        role: "admin",
        timestamp: new Date().toISOString(),
        expiresAt: expiryTime,
      });

      const token = encodeSafe(tokenPayload);

      return NextResponse.json({ success: true, token }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: "INVALID ADMIN KEY" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "INTERNAL SERVER ERROR" },
      { status: 500 },
    );
  }
}
