import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC7alVWDiyvgXr5FMufNTlNXmiUhhE6iw",
  authDomain: "bankloansystem-30fa4.firebaseapp.com",
  projectId: "bankloansystem-30fa4",
  storageBucket: "bankloansystem-30fa4.firebasestorage.app",
  messagingSenderId: "478739074282",
  appId: "1:478739074282:web:6408b586e0652f589cdb93"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;


