import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { heading } = body;

    if (!heading) {
      return NextResponse.json(
        { unique: false, error: "No heading provided" },
        { status: 400 },
      );
    }

    const q = query(
      collection(db, "blogs"),
      where("heading", "==", heading),
      limit(1),
    );

    const querySnapshot = await getDocs(q);

    return NextResponse.json({ unique: querySnapshot.empty }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
