import * as admin from 'firebase-admin';

// Initialize Firebase Admin only if not already initialized
let db: admin.firestore.Firestore | null = null;

try {
    if (!admin.apps.length) {
        admin.initializeApp(); // Using default credentials (e.g. GOOGLE_APPLICATION_CREDENTIALS)
    }
    db = admin.firestore();
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Firebase initialization failed. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.", error);
}

const auth = admin.auth();

export { db, auth };
