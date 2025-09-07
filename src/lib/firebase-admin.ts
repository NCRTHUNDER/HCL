
"use server";

import * as admin from 'firebase-admin';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app;
if (!getApps().length) {
    try {
        // Only use credentials if the service account key is provided
        const credential = serviceAccountKey 
            ? cert(JSON.parse(serviceAccountKey)) 
            : undefined;
        
        if (credential) {
            app = initializeApp({ credential });
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found. Initializing with default server credentials. Some admin features may be limited.");
            app = initializeApp();
        }

    } catch(e: any) {
        console.error("Failed to initialize Firebase Admin SDK. Error: " + e.message);
        // Fallback for environments where initialization might fail for other reasons.
        app = initializeApp();
    }
} else {
    app = getApp();
}

const db = getFirestore(app);
const authAdmin = getAuth(app);

export { app, db, authAdmin as auth };
