import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) throw new Error("Unauthorized");
  await adminAuth.verifySessionCookie(sessionCookie, true);
}

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const { title, image } = await req.json();
    if (!image) return NextResponse.json({ error: "Missing Image" }, { status: 400 });

    await adminDb.collection("proofs").add({
      title: title || "",
      image,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await verifyAdmin();
    const { id, active } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await adminDb.collection("proofs").doc(id).update({ active });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    await verifyAdmin();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await adminDb.collection("proofs").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}
