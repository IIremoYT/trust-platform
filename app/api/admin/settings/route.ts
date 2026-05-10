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

    // Build human-readable change summary
    const changes: string[] = [];
    if (settings.maintenanceMode !== undefined) changes.push(settings.maintenanceMode ? "تفعيل وضع الصيانة" : "إلغاء وضع الصيانة");
    if (settings.showAnnouncementBar !== undefined) changes.push(settings.showAnnouncementBar ? "تفعيل الشريط الإعلاني" : "إخفاء الشريط الإعلاني");
    if (settings.announcementText !== undefined) changes.push("تعديل نص الإعلان");
    if (settings.showAnnouncementButton !== undefined) changes.push(settings.showAnnouncementButton ? "تفعيل زر الأكشن" : "إخفاء زر الأكشن");
    if (settings.announcementButtonText !== undefined) changes.push("تعديل نص الزر");
    if (settings.announcementButtonLink !== undefined) changes.push("تعديل رابط الزر");

    logAudit("settings_updated", { summary: changes.join(" • ") || "تحديث الإعدادات" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Unauthorized or Internal Error" },
      { status: 401 }
    );
  }
}
