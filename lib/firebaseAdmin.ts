import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // محاولة تحميل ملف الـ Service Account من المسار الجذري
    const serviceAccount = require("../serviceAccountKey.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
