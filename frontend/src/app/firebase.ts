// ──────────────────────────────────────────────────────────────────────────────
// Firebase configuration — PLACEHOLDER values
// Replace these with your actual Firebase project credentials from:
//   https://console.firebase.google.com → Project Settings → General → Your apps
// ──────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3qjkRIa_9eL85UrjxOz_GPrXxEwyuqOA",
  authDomain: "inventory-manager-6445a.firebaseapp.com",
  projectId: "inventory-manager-6445a",
  storageBucket: "inventory-manager-6445a.firebasestorage.app",
  messagingSenderId: "82422168569",
  appId: "1:82422168569:web:6f9a7290357fefa595db28",
  measurementId: "G-STRCQCFB3B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
