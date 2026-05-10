import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) throw new Error("Unauthorized");
  await adminAuth.verifySessionCookie(sessionCookie, true);
}

// GET: Fetch latest 50 audit events
export async function GET() {
  try {
    await verifyAdmin();

    const snap = await adminDb
      .collection("audit")
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const events = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
