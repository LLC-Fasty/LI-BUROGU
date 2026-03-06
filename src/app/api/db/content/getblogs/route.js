import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const blogsRef = collection(db, "blogs");

    const q = query(blogsRef, orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);

    const blogs = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        heading: data.heading,
        time: data.time,
        cid: data.cid,
        content: data.content,
      };
    });

    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
