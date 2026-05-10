import { adminDb } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";

type AuditAction =
  | "proof_created"
  | "proof_status_changed"
  | "proof_deleted"
  | "review_approved"
  | "review_deleted"
  | "payment_created"
  | "payment_deleted"
  | "settings_updated"
  | "admin_login_failed";

/**
 * Lightweight audit logger.
 * Writes a single document to the 'audit' collection.
 * Fire-and-forget — does not throw on failure.
 */
export async function logAudit(
  action: AuditAction,
  details?: Record<string, unknown>
) {
  try {
    await adminDb.collection("audit").add({
      action,
      details: details || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    // Silent fail — audit should never break the main flow
    console.error("Audit log failed:", e);
  }
}
