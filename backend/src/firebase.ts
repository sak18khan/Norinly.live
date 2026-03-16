import * as admin from 'firebase-admin';

// Initialize Firebase Admin only if not already initialized
// auth and db are nullable — the server runs fine without Firebase (moderation features degrade gracefully)
let db: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

try {
    if (!admin.apps.length) {
        admin.initializeApp(); // Uses GOOGLE_APPLICATION_CREDENTIALS env var in production
    }
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin initialized successfully.');
} catch (error) {
    console.warn(
        'Firebase Admin initialization skipped — GOOGLE_APPLICATION_CREDENTIALS not set. ' +
        'Moderation features (bans, reports) will use in-memory fallback only.',
        (error as Error).message
    );
}

export { db, auth };
