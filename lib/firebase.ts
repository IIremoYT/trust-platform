import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

// Initialize App Check only on the client side
if (typeof window !== "undefined") {
  // @ts-ignore - to prevent build errors if the key is missing in some environments
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NODE_ENV !== 'production';
  
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    } catch (e) {
      console.warn("App Check initialization failed", e);
    }
  }
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);