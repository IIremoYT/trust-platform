import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ3chCeVgkKANkJLRVBZPrY_q3qvkLuSA",
  authDomain: "trust-platform-test.firebaseapp.com",
  projectId: "trust-platform-test",
  storageBucket: "trust-platform-test.firebasestorage.app",
  messagingSenderId: "573648750256",
  appId: "1:573648750256:web:5827f4189f18715a829d75",
  measurementId: "G-JDM383NHJ1"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// NOTE: App Check is disabled because the reCAPTCHA site key is not
// registered as an App Check provider in the Firebase Console.
// The platform is already secured via server-side session cookies,
// Firestore rules, and API-level authentication checks.

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);