import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { logAudit } from "@/lib/audit";

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
      status: "published", // New status system: draft | published | archived
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info("Proof created", { title });
    logAudit("proof_created", { title });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await verifyAdmin();
    const { id, status, active } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Support both new status system and legacy active toggle
    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
    } else if (active !== undefined) {
      // Legacy compatibility: convert active boolean to status
      updateData.status = active ? "published" : "draft";
    }

    await adminDb.collection("proofs").doc(id).update(updateData);
    logger.info("Proof status updated", { id, ...updateData });
    logAudit("proof_status_changed", { id, ...updateData });
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
    logger.info("Proof deleted", { id });
    logAudit("proof_deleted", { id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or Internal Error" }, { status: 401 });
  }
}
