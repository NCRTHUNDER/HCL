"use client";

import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAJnBfdPbZXOuFlTB07DjweeCbzHrsgjkM",
  authDomain: "docuquery-1gobw.firebaseapp.com",
  projectId: "docuquery-1gobw",
  storageBucket: "docuquery-1gobw.firebasestorage.app",
  messagingSenderId: "614664630044",
  appId: "1:614664630044:web:15e8ac0cd7ecfd3a96d4d9",
};

let app;

// This check is important to prevent re-initializing the app on every render.
if (!getApps().length) {
    // Check if all required config values are present
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
    } else {
        console.error("Firebase config is missing or incomplete.");
        // We are not initializing the app here, so auth and db will be null.
        // The UI should handle this gracefully.
    }
} else {
    app = getApp();
}

// Conditionally get auth and db only if the app was initialized
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { app, auth, db };
