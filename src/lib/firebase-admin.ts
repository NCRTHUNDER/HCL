
"use server";

import * as admin from 'firebase-admin';
import { getApps, getApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
if (!getApps().length) {
    try {
        app = initializeApp();
    } catch(e: any) {
        console.error("Failed to initialize Firebase Admin SDK. Error: " + e.message);
        // Fallback for environments where initialization might fail for other reasons.
        app = initializeApp();
    }
} else {
    app = getApp();
}

const db = getFirestore(app);

export { app, db };
