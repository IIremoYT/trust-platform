import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { logAudit } from "@/lib/audit";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) throw new Error("Unauthorized");
  await adminAuth.verifySessionCookie(sessionCookie, true);
}

export async function PATCH(req: Request) {
  try {
    await verifyAdmin();
    const { id, active } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await adminDb.collection("reviews").doc(id).update({ active });
    logAudit("review_approved", { id, active });
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

    await adminDb.collection("reviews").doc(id).delete();
    logAudit("review_deleted", { id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}
