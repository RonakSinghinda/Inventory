// ──────────────────────────────────────────────────────────────────────────────
// Firebase Admin SDK initialization
//
// To enable Google sign-in token verification:
//   1. Go to Firebase Console → Project Settings → Service Accounts
//   2. Generate a new private key (JSON file)
//   3. Either:
//      a) Set GOOGLE_APPLICATION_CREDENTIALS env var to the path of that JSON, or
//      b) Set FIREBASE_PROJECT_ID in your .env
//
// For development, you can initialize without credentials if you only need
// to verify ID tokens (Firebase will use the project ID to fetch public keys).
// ──────────────────────────────────────────────────────────────────────────────

import admin from 'firebase-admin';
import { env } from '../config/env';

if (!admin.apps.length) {
  admin.initializeApp({
    // If GOOGLE_APPLICATION_CREDENTIALS is set, the SDK picks it up automatically.
    // Otherwise, minimal init with project ID from env.
    projectId: env.FIREBASE_PROJECT_ID || undefined,
  });
}

export const firebaseAuth = admin.auth();
