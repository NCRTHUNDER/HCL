
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";

// Your web app's Firebase configuration
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
    try {
        app = initializeApp(firebaseConfig);
    } catch (e) {
        console.error("Firebase initialization error", e);
    }
} else {
    app = getApp();
}

export { app };
