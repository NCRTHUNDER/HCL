"use server";

import * as admin from 'firebase-admin';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app;
if (!getApps().length) {
    try {
        const credential = serviceAccountKey 
            ? cert(JSON.parse(serviceAccountKey)) 
            : undefined;
        
        app = initializeApp({ credential });
    } catch(e) {
        console.error("Failed to initialize Firebase Admin SDK", e);
        // Fallback for environments without service account key, with limited privileges.
        app = initializeApp();
    }
} else {
    app = getApp();
}

const db = getFirestore(app);
const authAdmin = getAuth(app);

export { app, db, authAdmin as auth };
