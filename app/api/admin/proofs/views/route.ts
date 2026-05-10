import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

// Simple in-memory deduplication (reset on cold boot — acceptable for lightweight tracking)
const recentViews = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { proofId } = await req.json();
    if (!proofId || typeof proofId !== "string") {
      return NextResponse.json({ error: "Missing proofId" }, { status: 400 });
    }

    // Basic deduplication: same proof can only be counted once per 30 seconds per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${proofId}`;
    const now = Date.now();
    const lastView = recentViews.get(key) || 0;

    if (now - lastView < 30000) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    recentViews.set(key, now);

    // Cleanup old entries periodically
    if (recentViews.size > 500) recentViews.clear();

    // Increment view counter
    await adminDb.collection("proofs").doc(proofId).update({
      views: admin.firestore.FieldValue.increment(1),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
