import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { decodeSafe, encodeSafe } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { id, operation, newData } = body;
    if (!id)
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 },
      );

    const blogRef = doc(db, "blogs", id);

    if (operation === "DELETE") {
      await deleteDoc(blogRef);
      return NextResponse.json({
        success: true,
        message: "Blog deleted successfully",
      });
    }

    if (operation === "UPDATE") {
      let operationData = decodeSafe(newData);

      const { heading, content, ip } = JSON.parse(operationData);

      const updatedFields = {
        heading: encodeSafe(JSON.stringify(heading.toUpperCase())),
        content: encodeSafe(JSON.stringify(content)),

        updatedAt: new Date().toISOString(),
        updatedByIp: encodeSafe(JSON.stringify(ip || "unknown")),
      };

      await updateDoc(blogRef, updatedFields);
      return NextResponse.json({
        success: true,
        message: "Blog updated successfully",
      });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
