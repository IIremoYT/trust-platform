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
    const settings = await req.json();

    // The settings will be saved in the 'settings' collection inside the 'global' document
    await adminDb.collection("settings").doc("global").set(settings, { merge: true });
    logAudit("settings_updated", { keys: Object.keys(settings) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Unauthorized or Internal Error" },
      { status: 401 }
    );
  }
}
