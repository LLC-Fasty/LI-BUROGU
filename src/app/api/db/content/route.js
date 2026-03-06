import { db } from "@/lib/firebase";
import { decodeSafe, encodeSafe, generateBlogId } from "@/lib/utils";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { NextResponse } from "next/server";

async function isCidUnique(cid) {
  try {
    const q = query(collection(db, "blogs"), where("cid", "==", cid), limit(1));
    const querySnapshot = await getDocs(q);
    return { unique: querySnapshot.empty, error: null };
  } catch (err) {
    return { unique: false, error: "Database Connection Failed" };
  }
}

async function isHeadingUnique(encodedHeading) {
  try {
    const q = query(
      collection(db, "blogs"),
      where("heading", "==", encodedHeading),
      limit(1),
    );
    const querySnapshot = await getDocs(q);
    return { unique: querySnapshot.empty, error: null };
  } catch (err) {
    return { unique: false, error: "Database Connection Error" };
  }
}

async function saveBlogToFirestore(data) {
  const { heading, content, ip } = data;

  const encodedHeading = encodeSafe(JSON.stringify(heading));

  const headingCheck = await isHeadingUnique(encodedHeading);
  if (headingCheck.error) return { error: headingCheck.error };
  if (!headingCheck.unique) {
    return {
      error: "DUPLICATE_HEADING: A blog with this title already exists.",
    };
  }

  let uniqueCid = generateBlogId();
  let attempts = 0;
  const maxAttempts = 5;

  let check = await isCidUnique(uniqueCid);
  while (!check.unique) {
    if (check.error) return { error: check.error };

    uniqueCid = generateBlogId();
    attempts++;
    if (attempts >= maxAttempts) return { error: "CID Generation Timeout" };

    check = await isCidUnique(uniqueCid);
  }

  const blogData = {
    heading: encodedHeading,
    content: encodeSafe(JSON.stringify(content)),
    ip: encodeSafe(JSON.stringify(ip)),
    time: new Date().toISOString(),
    like: [],
    dislike: [],
    cid: uniqueCid,
  };

  try {
    const docRef = await addDoc(collection(db, "blogs"), blogData);
    return {
      data: { id: docRef.id, cid: uniqueCid },
      error: null,
    };
  } catch (dbError) {
    return {
      data: null,
      error:
        dbError.code === "permission-denied" ? "Access Denied" : "Write Failed",
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const decodedRaw = decodeSafe(body);
    if (!decodedRaw)
      return NextResponse.json({ error: "Invalid Encoding" }, { status: 400 });

    const { heading, content, ip } = JSON.parse(decodedRaw);

    if (!heading || !content) {
      return NextResponse.json({ error: "Missing Content" }, { status: 400 });
    }

    const result = await saveBlogToFirestore({ heading, content, ip });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Created", cid: result.data.cid },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
