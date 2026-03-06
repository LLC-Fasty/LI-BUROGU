import { db } from "@/lib/firebase";
import { decodeSafe, encodeSafe } from "@/lib/utils";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { iData, operation } = await request.json();
    const edata = decodeSafe(iData);
    const dData = JSON.parse(edata);
    const { blogId, userIp: duserIp, action } = dData;
    const userIp = encodeSafe(duserIp);
    if (!blogId || !userIp) {
      return NextResponse.json(
        { success: false, error: "Missing Parameters" },
        { status: 400 },
      );
    }

    const blogRef = doc(db, "blogs", blogId);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    const data = blogSnap.data();
    const likes = data.like || [];
    const dislikes = data.dislike || [];

    if (operation === "GET_STATUS") {
      const retData = encodeSafe(
        JSON.stringify({
          likes: likes.length,
          dislikes: dislikes.length,
          userHasLiked: likes.includes(userIp),
          userHasDisliked: dislikes.includes(userIp),
        }),
      );
      return NextResponse.json({
        success: true,
        data: retData,
      });
    }

    if (operation === "TOGGLE_ACTION") {
      const hasLiked = likes.includes(userIp);
      const hasDisliked = dislikes.includes(userIp);
      let updateData = {};

      if (action === "like") {
        updateData = hasLiked
          ? { like: arrayRemove(userIp) }
          : { like: arrayUnion(userIp), dislike: arrayRemove(userIp) };
      } else if (action === "dislike") {
        updateData = hasDisliked
          ? { dislike: arrayRemove(userIp) }
          : { dislike: arrayUnion(userIp), like: arrayRemove(userIp) };
      }

      await updateDoc(blogRef, updateData);

      const updatedSnap = await getDoc(blogRef);
      const updatedData = updatedSnap.data();

      const rData = encodeSafe(
        JSON.stringify({
          likes: updatedData.like?.length || 0,
          dislikes: updatedData.dislike?.length || 0,
          userHasLiked: updatedData.like?.includes(userIp),
          userHasDisliked: updatedData.dislike?.includes(userIp),
        }),
      );
      return NextResponse.json({
        success: true,
        data: rData,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid Operation" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
