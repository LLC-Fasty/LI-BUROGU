import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { encodeSafe } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { cid } = body;

    const docRef = doc(db, "blogs", cid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ success: false });
    }

    const data = docSnap.data();

    let encdata = encodeSafe(
      JSON.stringify({
        heading: data.heading,
        content: data.content,
        time: data.time,
        likes: data.like?.length || 0,
        dislikes: data.dislike?.length || 0,
        id: docSnap.id,
      }),
    );

    return NextResponse.json({
      success: true,
      data: encdata,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
