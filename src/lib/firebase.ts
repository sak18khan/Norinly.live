import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCpWTJ-doB8foqXtAF9FA5RUVfj-pk0Sog',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'norinly-live.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'norinly-live',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'norinly-live.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '263649439378',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:263649439378:web:5a7d44202ce5aba6ba804b',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-93G5V5N1JF'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
    const { enableMultiTabIndexedDbPersistence } = require('firebase/firestore');
    enableMultiTabIndexedDbPersistence(db).catch((err: any) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support all of the features required to enable persistence.');
        }
    });
}
const googleProvider = new GoogleAuthProvider();

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    isSupported().then(yes => {
        if (yes) analytics = getAnalytics(app);
    });
}

export { auth, db, googleProvider, analytics };

