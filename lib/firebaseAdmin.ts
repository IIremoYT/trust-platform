import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    let credential;

    if (process.env.FIREBASE_PRIVATE_KEY) {
      try {
        credential = admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.projectId || "trust-platform-test",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@trust-platform-test.iam.gserviceaccount.com",
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
      } catch (certError) {
        console.warn("Invalid Firebase credentials provided in Env Vars:", certError);
      }
    } else {
      // Local development fallback using fs to avoid Webpack bundling errors on Vercel
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        try {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          credential = admin.credential.cert(serviceAccount);
        } catch (localErr) {
          console.warn("Failed to parse local serviceAccountKey.json", localErr);
        }
      }
    }

    if (credential) {
      admin.initializeApp({
        credential,
      });
    } else {
      console.warn("Firebase Admin credentials not found or invalid. Using dummy project to pass build.");
      admin.initializeApp({ projectId: "dummy-project-to-pass-build" });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
    // Ultimate fallback so the build NEVER crashes
    if (!admin.apps.length) {
      admin.initializeApp({ projectId: "dummy-project-to-pass-build" });
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
